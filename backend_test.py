#!/usr/bin/env python3
import requests
import json
import unittest
import os
import sys

# Get the backend URL from the frontend .env file
def get_backend_url():
    with open('/app/frontend/.env', 'r') as f:
        for line in f:
            if line.startswith('REACT_APP_BACKEND_URL='):
                return line.strip().split('=')[1].strip('"\'')
    return None

BACKEND_URL = get_backend_url()
if not BACKEND_URL:
    print("Error: Could not find REACT_APP_BACKEND_URL in frontend/.env")
    sys.exit(1)

print(f"Using backend URL: {BACKEND_URL}")

class EmailMarketingAPITest(unittest.TestCase):
    def setUp(self):
        self.base_url = f"{BACKEND_URL}/api"
        
    def test_health_check(self):
        """Test the health check endpoint"""
        print("\n--- Testing Health Check Endpoint ---")
        response = requests.get(f"{self.base_url}/health")
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "healthy")
        
    def test_deliverability_valid_domain(self):
        """Test deliverability checker with valid domain"""
        print("\n--- Testing Deliverability Checker with Valid Domain ---")
        payload = {"domain": "google.com"}
        response = requests.post(f"{self.base_url}/check-deliverability", json=payload)
        
        print(f"Status Code: {response.status_code}")
        data = response.json()
        print(f"Overall Score: {data.get('overall_score')}")
        print(f"Summary: {data.get('summary')}")
        print(f"Number of Checks: {len(data.get('checks', []))}")
        print(f"Number of Recommendations: {len(data.get('recommendations', []))}")
        
        self.assertEqual(response.status_code, 200)
        self.assertIn("overall_score", data)
        self.assertIn("checks", data)
        self.assertIn("recommendations", data)
        self.assertIn("summary", data)
        self.assertIn("domain", data)
        self.assertEqual(data["domain"], "google.com")
        
        # Verify checks structure
        for check in data["checks"]:
            self.assertIn("name", check)
            self.assertIn("description", check)
            self.assertIn("passed", check)
            self.assertIn("result", check)
            
        # Verify recommendations structure if any
        for rec in data["recommendations"]:
            self.assertIn("title", rec)
            self.assertIn("description", rec)
    
    def test_deliverability_invalid_domain(self):
        """Test deliverability checker with invalid domain format"""
        print("\n--- Testing Deliverability Checker with Invalid Domain ---")
        payload = {"domain": "invalid-domain-format"}
        response = requests.post(f"{self.base_url}/check-deliverability", json=payload)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        self.assertEqual(response.status_code, 422)  # Validation error
        
    def test_revenue_calculator_valid_data(self):
        """Test revenue calculator with valid data"""
        print("\n--- Testing Revenue Calculator with Valid Data ---")
        payload = {
            "monthly_revenue": 50000,
            "industry": "fashion",
            "has_email_marketing": False,
            "has_sms_marketing": False
        }
        response = requests.post(f"{self.base_url}/calculate-revenue", json=payload)
        
        print(f"Status Code: {response.status_code}")
        data = response.json()
        print(f"Current Monthly: {data.get('current_monthly')}")
        print(f"Email Potential: {data.get('email_potential')}")
        print(f"SMS Potential: {data.get('sms_potential')}")
        print(f"Total Monthly Increase: {data.get('total_monthly_increase')}")
        print(f"Annual Potential: {data.get('annual_potential')}")
        print(f"Industry: {data.get('industry')}")
        
        self.assertEqual(response.status_code, 200)
        self.assertIn("current_monthly", data)
        self.assertIn("email_potential", data)
        self.assertIn("sms_potential", data)
        self.assertIn("total_monthly_increase", data)
        self.assertIn("annual_potential", data)
        self.assertIn("industry", data)
        
        # Verify calculations for fashion industry
        # Fashion industry has email_roi: 25%, sms_roi: 20%
        self.assertEqual(data["current_monthly"], 50000)
        self.assertEqual(data["email_potential"], 50000 * 0.25)  # 25% of monthly revenue
        self.assertEqual(data["sms_potential"], 50000 * 0.20)    # 20% of monthly revenue
        self.assertEqual(data["total_monthly_increase"], (50000 * 0.25) + (50000 * 0.20))
        self.assertEqual(data["annual_potential"], ((50000 * 0.25) + (50000 * 0.20)) * 12)
        self.assertEqual(data["industry"], "Fashion & Apparel")
        
    def test_revenue_calculator_with_existing_marketing(self):
        """Test revenue calculator with existing marketing channels"""
        print("\n--- Testing Revenue Calculator with Existing Marketing Channels ---")
        payload = {
            "monthly_revenue": 50000,
            "industry": "fashion",
            "has_email_marketing": True,
            "has_sms_marketing": True
        }
        response = requests.post(f"{self.base_url}/calculate-revenue", json=payload)
        
        print(f"Status Code: {response.status_code}")
        data = response.json()
        print(f"Email Potential: {data.get('email_potential')}")
        print(f"SMS Potential: {data.get('sms_potential')}")
        
        self.assertEqual(response.status_code, 200)
        
        # Verify calculations with existing marketing (30% improvement)
        # Fashion industry has email_roi: 25%, sms_roi: 20%
        self.assertEqual(data["email_potential"], 50000 * 0.25 * 0.3)  # 25% * 30% of monthly revenue
        self.assertEqual(data["sms_potential"], 50000 * 0.20 * 0.3)    # 20% * 30% of monthly revenue
        
    def test_revenue_calculator_different_industries(self):
        """Test revenue calculator with different industries"""
        print("\n--- Testing Revenue Calculator with Different Industries ---")
        industries = ["general", "beauty", "electronics"]
        
        for industry in industries:
            payload = {
                "monthly_revenue": 50000,
                "industry": industry,
                "has_email_marketing": False,
                "has_sms_marketing": False
            }
            response = requests.post(f"{self.base_url}/calculate-revenue", json=payload)
            
            print(f"\nIndustry: {industry}")
            print(f"Status Code: {response.status_code}")
            data = response.json()
            print(f"Email Potential: {data.get('email_potential')}")
            print(f"SMS Potential: {data.get('sms_potential')}")
            
            self.assertEqual(response.status_code, 200)
            self.assertIn("industry", data)
            
    def test_revenue_calculator_invalid_industry(self):
        """Test revenue calculator with invalid industry"""
        print("\n--- Testing Revenue Calculator with Invalid Industry ---")
        payload = {
            "monthly_revenue": 50000,
            "industry": "invalid_industry",
            "has_email_marketing": False,
            "has_sms_marketing": False
        }
        response = requests.post(f"{self.base_url}/calculate-revenue", json=payload)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        self.assertEqual(response.status_code, 500)  # Server error
        self.assertIn("detail", response.json())
        self.assertIn("Invalid industry selected", response.json()["detail"])

if __name__ == "__main__":
    unittest.main(argv=['first-arg-is-ignored'], exit=False)