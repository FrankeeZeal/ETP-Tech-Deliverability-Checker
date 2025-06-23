import os
import re
import dns.resolver
import socket
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, validator
from typing import Optional, List, Dict
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Email Marketing Deliverability & Revenue Calculator API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class DeliverabilityRequest(BaseModel):
    domain: str
    
    @validator('domain')
    def validate_domain(cls, v):
        if not v:
            raise ValueError('Domain is required')
        # Remove protocol and trailing slash if present
        domain = re.sub(r'^https?://', '', v)
        domain = domain.rstrip('/')
        # Basic domain validation
        domain_pattern = r'^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.([a-zA-Z]{2,}\.?)*[a-zA-Z]{2,}$'
        if not re.match(domain_pattern, domain):
            raise ValueError('Invalid domain format')
        return domain

class DeliverabilityResponse(BaseModel):
    domain: str
    overall_score: int
    summary: str
    checks: List[Dict]
    recommendations: List[Dict]

class RevenueRequest(BaseModel):
    monthly_revenue: float
    industry: str
    has_email_marketing: bool
    has_sms_marketing: bool
    current_email_revenue: Optional[float] = 0
    current_sms_revenue: Optional[float] = 0

class RevenueResponse(BaseModel):
    current_monthly: float
    current_email_revenue: float
    current_sms_revenue: float
    email_potential: float
    sms_potential: float
    total_monthly_increase: float
    annual_potential: float
    industry: str
    calculation_breakdown: Dict

# Helper functions for deliverability checks
def check_mx_record(domain: str) -> Dict:
    """Check if domain has MX records"""
    try:
        mx_records = dns.resolver.resolve(domain, 'MX')
        return {
            'name': 'MX Record Check',
            'description': 'Verifies that your domain can receive emails',
            'passed': len(mx_records) > 0,
            'result': f'Found {len(mx_records)} MX record(s)' if mx_records else 'No MX records found'
        }
    except Exception as e:
        return {
            'name': 'MX Record Check',
            'description': 'Verifies that your domain can receive emails',
            'passed': False,
            'result': f'Error checking MX records: {str(e)}'
        }

def check_spf_record(domain: str) -> Dict:
    """Check SPF record"""
    try:
        txt_records = dns.resolver.resolve(domain, 'TXT')
        spf_found = False
        spf_record = ""
        
        for record in txt_records:
            record_str = str(record).strip('"')
            if record_str.startswith('v=spf1'):
                spf_found = True
                spf_record = record_str
                break
        
        return {
            'name': 'SPF Record Check',
            'description': 'Sender Policy Framework helps prevent email spoofing',
            'passed': spf_found,
            'result': f'SPF record found: {spf_record[:50]}...' if spf_found else 'No SPF record found'
        }
    except Exception as e:
        return {
            'name': 'SPF Record Check',
            'description': 'Sender Policy Framework helps prevent email spoofing',
            'passed': False,
            'result': f'Error checking SPF record: {str(e)}'
        }

def check_dkim_record(domain: str) -> Dict:
    """Check for DKIM selectors - comprehensive check"""
    # Expanded list of common DKIM selectors
    common_selectors = [
        'default', 'google', 'k1', 'k2', 'mail', 'dkim', 'selector1', 'selector2',
        'key1', 'key2', 'smtp', 'email', 'mailgun', 'mandrill', 'sendgrid',
        'amazonses', 'sparkpost', 'postmark', 'mailchimp', 'constantcontact',
        'campaignmonitor', 'klaviyo', 'brevo', 'sendinblue', 'mailjet',
        'elastic', 'dkim1', 'dkim2', 's1', 's2', 'mxvault'
    ]
    
    dkim_found = False
    found_selector = None
    dkim_record = ""
    
    for selector in common_selectors:
        try:
            dkim_domain = f"{selector}._domainkey.{domain}"
            records = dns.resolver.resolve(dkim_domain, 'TXT')
            for record in records:
                record_str = str(record).strip('"')
                if 'p=' in record_str:  # DKIM records contain public key with p= parameter
                    dkim_found = True
                    found_selector = selector
                    dkim_record = record_str[:100] + "..." if len(record_str) > 100 else record_str
                    break
            if dkim_found:
                break
        except Exception:
            continue
    
    if dkim_found:
        result = f'DKIM record found (selector: {found_selector}): {dkim_record}'
    else:
        result = 'No DKIM records found with common selectors. Consider checking your email service provider documentation for the correct DKIM selector.'
    
    return {
        'name': 'DKIM Record Check',
        'description': 'DomainKeys Identified Mail provides email authentication and helps prevent spoofing',
        'passed': dkim_found,
        'result': result
    }

def check_dmarc_record(domain: str) -> Dict:
    """Check DMARC record"""
    try:
        dmarc_domain = f"_dmarc.{domain}"
        txt_records = dns.resolver.resolve(dmarc_domain, 'TXT')
        dmarc_found = False
        dmarc_record = ""
        
        for record in txt_records:
            record_str = str(record).strip('"')
            if record_str.startswith('v=DMARC1'):
                dmarc_found = True
                dmarc_record = record_str
                break
        
        return {
            'name': 'DMARC Record Check',
            'description': 'Domain-based Message Authentication helps with email authentication',
            'passed': dmarc_found,
            'result': f'DMARC record found: {dmarc_record[:50]}...' if dmarc_found else 'No DMARC record found'
        }
    except Exception as e:
        return {
            'name': 'DMARC Record Check',
            'description': 'Domain-based Message Authentication helps with email authentication',
            'passed': False,
            'result': f'Error checking DMARC record: {str(e)}'
        }

def check_domain_reputation(domain: str) -> Dict:
    """Basic domain reputation check"""
    try:
        # Try to resolve the domain
        socket.gethostbyname(domain)
        return {
            'name': 'Domain Resolution',
            'description': 'Checks if the domain resolves properly',
            'passed': True,
            'result': 'Domain resolves successfully'
        }
    except Exception as e:
        return {
            'name': 'Domain Resolution',
            'description': 'Checks if the domain resolves properly',
            'passed': False,
            'result': f'Domain resolution failed: {str(e)}'
        }

def generate_recommendations(checks: List[Dict]) -> List[Dict]:
    """Generate recommendations based on failed checks"""
    recommendations = []
    
    for check in checks:
        if not check['passed']:
            if 'MX Record' in check['name']:
                recommendations.append({
                    'title': 'Set up MX Records',
                    'description': 'Configure MX records in your DNS settings to enable email receiving. Contact your DNS provider or hosting company for assistance.'
                })
            elif 'SPF' in check['name']:
                recommendations.append({
                    'title': 'Configure SPF Record',
                    'description': 'Add an SPF record to your DNS (e.g., "v=spf1 include:_spf.google.com ~all" for Google Workspace) to prevent email spoofing.'
                })
            elif 'DKIM' in check['name']:
                recommendations.append({
                    'title': 'Set up DKIM Authentication',
                    'description': 'Enable DKIM in your email service provider and add the DKIM record to your DNS settings for better email authentication.'
                })
            elif 'DMARC' in check['name']:
                recommendations.append({
                    'title': 'Implement DMARC Policy',
                    'description': 'Create a DMARC record starting with "v=DMARC1; p=none;" to monitor email authentication and gradually strengthen your policy.'
                })
            elif 'Domain Resolution' in check['name']:
                recommendations.append({
                    'title': 'Fix Domain Resolution',
                    'description': 'Ensure your domain is properly configured and accessible. Check with your domain registrar or DNS provider.'
                })
    
    # Add general recommendations
    if len([c for c in checks if c['passed']]) < len(checks):
        recommendations.append({
            'title': 'Regular Monitoring',
            'description': 'Set up regular monitoring of your email deliverability metrics and DNS records to catch issues early.'
        })
    
    return recommendations

# API endpoints
@app.get("/")
async def root():
    return {"message": "Email Marketing Deliverability & Revenue Calculator API"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "message": "API is running"}

@app.post("/api/check-deliverability", response_model=DeliverabilityResponse)
async def check_deliverability(request: DeliverabilityRequest):
    """Check email deliverability for a domain"""
    try:
        domain = request.domain
        logger.info(f"Checking deliverability for domain: {domain}")
        
        # Perform all checks
        checks = [
            check_mx_record(domain),
            check_spf_record(domain),
            check_dkim_record(domain),
            check_dmarc_record(domain),
            check_domain_reputation(domain)
        ]
        
        # Calculate overall score
        passed_checks = sum(1 for check in checks if check['passed'])
        overall_score = int((passed_checks / len(checks)) * 100)
        
        # Generate summary
        if overall_score >= 80:
            summary = "Excellent! Your email setup looks great with strong authentication."
        elif overall_score >= 60:
            summary = "Good setup, but there are some areas for improvement."
        else:
            summary = "Your email setup needs attention to improve deliverability."
        
        # Generate recommendations
        recommendations = generate_recommendations(checks)
        
        return DeliverabilityResponse(
            domain=domain,
            overall_score=overall_score,
            summary=summary,
            checks=checks,
            recommendations=recommendations
        )
        
    except Exception as e:
        logger.error(f"Error checking deliverability: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error checking deliverability: {str(e)}")

@app.post("/api/calculate-revenue", response_model=RevenueResponse)
async def calculate_revenue(request: RevenueRequest):
    """Calculate potential revenue from email and SMS marketing"""
    try:
        # Industry-specific ROI data (percentage of revenue)
        industry_data = {
            'general': {'email_roi': 20, 'sms_roi': 15, 'name': 'General E-commerce'},
            'fashion': {'email_roi': 25, 'sms_roi': 20, 'name': 'Fashion & Apparel'},
            'beauty': {'email_roi': 30, 'sms_roi': 25, 'name': 'Beauty & Cosmetics'},  
            'electronics': {'email_roi': 18, 'sms_roi': 12, 'name': 'Electronics'},
            'home': {'email_roi': 22, 'sms_roi': 16, 'name': 'Home & Garden'},
            'food': {'email_roi': 28, 'sms_roi': 22, 'name': 'Food & Beverage'}
        }
        
        if request.industry not in industry_data:
            raise HTTPException(status_code=400, detail="Invalid industry selected")
        
        industry = industry_data[request.industry]
        monthly_revenue = request.monthly_revenue
        current_email_revenue = request.current_email_revenue or 0
        current_sms_revenue = request.current_sms_revenue or 0
        
        # Calculate theoretical maximum potential based on industry benchmarks
        max_email_potential = monthly_revenue * (industry['email_roi'] / 100)
        max_sms_potential = monthly_revenue * (industry['sms_roi'] / 100)
        
        # Calculate potential increase
        if request.has_email_marketing:
            # If already using email marketing, potential is the difference between max and current
            email_potential = max(0, max_email_potential - current_email_revenue)
        else:
            # If not using email marketing, show full potential
            email_potential = max_email_potential
            
        if request.has_sms_marketing:
            # If already using SMS marketing, potential is the difference between max and current
            sms_potential = max(0, max_sms_potential - current_sms_revenue)
        else:
            # If not using SMS marketing, show full potential
            sms_potential = max_sms_potential
        
        total_monthly_increase = email_potential + sms_potential
        annual_potential = total_monthly_increase * 12
        
        # Create detailed calculation breakdown
        calculation_breakdown = {
            'industry_benchmarks': {
                'email_roi_percent': industry['email_roi'],
                'sms_roi_percent': industry['sms_roi']
            },
            'max_potential': {
                'email': max_email_potential,
                'sms': max_sms_potential
            },
            'current_performance': {
                'email': current_email_revenue,
                'sms': current_sms_revenue
            },
            'improvement_potential': {
                'email': email_potential,
                'sms': sms_potential
            },
            'explanation': {
                'email': f"Based on {industry['name']} industry average of {industry['email_roi']}% revenue from email marketing",
                'sms': f"Based on {industry['name']} industry average of {industry['sms_roi']}% revenue from SMS marketing"
            }
        }
        
        return RevenueResponse(
            current_monthly=monthly_revenue,
            current_email_revenue=current_email_revenue,
            current_sms_revenue=current_sms_revenue,
            email_potential=email_potential,
            sms_potential=sms_potential,
            total_monthly_increase=total_monthly_increase,
            annual_potential=annual_potential,
            industry=industry['name'],
            calculation_breakdown=calculation_breakdown
        )
        
    except Exception as e:
        logger.error(f"Error calculating revenue: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error calculating revenue: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)