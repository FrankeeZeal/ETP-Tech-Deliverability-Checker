import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';

// Home Page Component
const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Email Marketing
          </h1>
          <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-orange-400 bg-clip-text text-transparent mb-6">
            Optimization Suite
          </h2>
          <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto mb-12">
            Check your email deliverability health, get actionable recommendations, 
            and discover your revenue potential with our powerful marketing tools.
          </p>
        </div>

        {/* Tool Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Link to="/deliverability" className="group">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 hover:border-cyan-400 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center mb-6 group-hover:shadow-lg group-hover:shadow-cyan-400/25 transition-all duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Deliverability Checker</h3>
              <p className="text-gray-400 mb-6">
                Analyze your email setup, check DNS records, and get a comprehensive deliverability health score with actionable recommendations.
              </p>
              <div className="flex items-center text-cyan-400 font-semibold">
                Check Health Score
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </Link>

          <Link to="/calculator" className="group">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 hover:border-orange-400 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/20">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center mb-6 group-hover:shadow-lg group-hover:shadow-orange-400/25 transition-all duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Revenue Calculator</h3>
              <p className="text-gray-400 mb-6">
                Estimate your potential revenue from email and SMS marketing based on your business size, industry, and current marketing efforts.
              </p>
              <div className="flex items-center text-orange-400 font-semibold">
                Calculate Revenue
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

// Deliverability Checker Component
const DeliverabilityChecker = () => {
  const [domain, setDomain] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState(null);
  const [animatedScore, setAnimatedScore] = React.useState(0);

  const checkDeliverability = async () => {
    if (!domain) return;
    
    setLoading(true);
    setResults(null);
    setAnimatedScore(0);
    
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/check-deliverability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain }),
      });
      const data = await response.json();
      setResults(data);
      
      // Animate score counter
      let current = 0;
      const target = data.overall_score;
      const increment = target / 50;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setAnimatedScore(target);
          clearInterval(timer);
        } else {
          setAnimatedScore(Math.floor(current));
        }
      }, 30);
      
    } catch (error) {
      console.error('Error checking deliverability:', error);
    }
    setLoading(false);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'from-green-400 to-emerald-500';
    if (score >= 60) return 'from-yellow-400 to-orange-500';
    return 'from-red-400 to-pink-500';
  };

  const getScoreGradient = (score) => {
    if (score >= 80) return 'bg-gradient-to-r from-green-400 to-emerald-500';
    if (score >= 60) return 'bg-gradient-to-r from-yellow-400 to-orange-500';
    return 'bg-gradient-to-r from-red-400 to-pink-500';
  };

  const calculateValueLoss = (score) => {
    // Calculate potential monthly email volume and value loss
    const baseEmailVolume = 50000; // Assume 50k emails per month for calculation
    const deliveryLossPercentage = (100 - score) / 100;
    const lostEmails = Math.floor(baseEmailVolume * deliveryLossPercentage);
    const valuePerEmail = 0.42; // Industry average email value
    const monthlyLoss = Math.floor(lostEmails * valuePerEmail);
    const annualLoss = monthlyLoss * 12;
    
    return {
      lostEmails,
      monthlyLoss,
      annualLoss,
      deliveryRate: 100 - (deliveryLossPercentage * 100)
    };
  };

  const CircularProgress = ({ percentage, size = 120, strokeWidth = 8, color = "cyan" }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;
    
    const colorClass = color === "cyan" ? "stroke-cyan-400" : 
                      color === "green" ? "stroke-green-400" :
                      color === "yellow" ? "stroke-yellow-400" : "stroke-red-400";

    return (
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-slate-700"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={`${colorClass} transition-all duration-1000 ease-out`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-2xl font-bold ${getScoreColor(percentage)}`}>
            {Math.round(percentage)}%
          </span>
        </div>
      </div>
    );
  };

  const InteractiveCheckCard = ({ check, index }) => {
    const [expanded, setExpanded] = React.useState(false);
    
    return (
      <div className={`bg-slate-800/50 backdrop-blur-sm border rounded-xl p-6 transition-all duration-300 hover:shadow-lg transform hover:scale-105 ${
        check.passed ? 'border-green-500/30 hover:border-green-400' : 'border-red-500/30 hover:border-red-400'
      }`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              check.passed ? 'bg-green-500' : 'bg-red-500'
            }`}>
              {check.passed ? 
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg> :
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              }
            </div>
            <h3 className="text-lg font-semibold text-white">{check.name}</h3>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className={`w-5 h-5 transform transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        
        <p className="text-gray-400 text-sm mb-3">{check.description}</p>
        <p className={`text-sm font-medium ${check.passed ? 'text-green-400' : 'text-red-400'}`}>
          {check.result}
        </p>
        
        {expanded && (
          <div className="mt-4 pt-4 border-t border-slate-600 animate-fadeInUp">
            <div className="text-sm text-gray-300">
              {!check.passed && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-3">
                  <p className="text-red-300 font-semibold mb-2">Impact of Missing {check.name}:</p>
                  <ul className="text-red-200 text-xs space-y-1">
                    {check.name.includes('MX') && (
                      <>
                        <li>• Emails cannot be delivered to your domain</li>
                        <li>• Complete failure of email communication</li>
                        <li>• Potential revenue loss: 100% of email marketing</li>
                      </>
                    )}
                    {check.name.includes('SPF') && (
                      <>
                        <li>• 15-30% of emails may be marked as spam</li>
                        <li>• Reduced sender reputation over time</li>
                        <li>• Potential revenue loss: $500-2000/month</li>
                      </>
                    )}
                    {check.name.includes('DKIM') && (
                      <>
                        <li>• 10-25% delivery rate reduction</li>
                        <li>• Higher spam folder placement</li>
                        <li>• Potential revenue loss: $300-1500/month</li>
                      </>
                    )}
                    {check.name.includes('DMARC') && (
                      <>
                        <li>• 5-15% delivery rate reduction</li>
                        <li>• Vulnerability to email spoofing</li>
                        <li>• Potential revenue loss: $200-800/month</li>
                      </>
                    )}
                  </ul>
                </div>
              )}
              {check.passed && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                  <p className="text-green-300 font-semibold mb-1">✓ Properly Configured</p>
                  <p className="text-green-200 text-xs">This configuration helps maintain optimal email deliverability and sender reputation.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Email Deliverability Checker
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Analyze your email setup and discover how much revenue you might be losing due to deliverability issues.
          </p>
        </div>

        {/* Input Section */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8">
            <div className="flex gap-4">
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="Enter your domain (e.g., yourstore.com)"
                className="flex-1 bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200"
                onKeyPress={(e) => e.key === 'Enter' && checkDeliverability()}
              />
              <button
                onClick={checkDeliverability}
                disabled={loading || !domain}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Checking...
                  </div>
                ) : 'Check Health'}
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {results && (
          <div className="max-w-6xl mx-auto">
            {/* Overall Score with Value Loss */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white mb-6">Deliverability Health Score</h2>
                  <div className="flex justify-center mb-6">
                    <CircularProgress 
                      percentage={animatedScore} 
                      size={140} 
                      strokeWidth={10}
                      color={results.overall_score >= 80 ? "green" : results.overall_score >= 60 ? "yellow" : "red"}
                    />
                  </div>
                  <p className={`text-xl font-semibold ${getScoreColor(results.overall_score)} mb-4`}>
                    {results.overall_score >= 80 ? 'Excellent' : results.overall_score >= 60 ? 'Good' : 'Needs Improvement'}
                  </p>
                  <p className="text-gray-300">{results.summary}</p>
                </div>
              </div>

              {/* Value Loss Analysis */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Revenue Impact Analysis</h2>
                {(() => {
                  const valueLoss = calculateValueLoss(results.overall_score);
                  return (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Estimated Delivery Rate</span>
                        <span className={`font-semibold ${getScoreColor(results.overall_score)}`}>
                          {results.overall_score}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Potential Lost Emails/Month</span>
                        <span className="text-red-400 font-semibold">
                          {valueLoss.lostEmails.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Potential Monthly Revenue Loss</span>
                        <span className="text-red-400 font-semibold">
                          ${valueLoss.monthlyLoss.toLocaleString()}
                        </span>
                      </div>
                      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mt-4">
                        <div className="text-center">
                          <p className="text-red-300 font-semibold mb-2">Annual Revenue at Risk</p>
                          <p className="text-3xl font-bold text-red-400">
                            ${valueLoss.annualLoss.toLocaleString()}
                          </p>
                          <p className="text-red-200 text-sm mt-2">
                            Based on industry average email value of $0.42 per email
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Interactive Detailed Results */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {results.checks.map((check, index) => (
                <InteractiveCheckCard key={index} check={check} index={index} />
              ))}
            </div>

            {/* Recommendations with Priority */}
            {results.recommendations.length > 0 && (
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6">
                  <span className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    Action Plan to Improve Deliverability
                  </span>
                </h2>
                <div className="space-y-6">
                  {results.recommendations.map((rec, index) => (
                    <div key={index} className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl p-6 hover:border-orange-400/40 transition-all duration-300">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-white text-sm font-bold">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-white font-semibold">{rec.title}</h3>
                            <span className="px-2 py-1 bg-orange-500/20 text-orange-300 text-xs rounded-full">
                              High Priority
                            </span>
                          </div>
                          <p className="text-gray-400 mb-3">{rec.description}</p>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-green-400">💰 Potential Recovery:</span>
                            <span className="text-green-300 font-semibold">
                              {rec.title.includes('SPF') ? '$500-2000/month' :
                               rec.title.includes('DKIM') ? '$300-1500/month' :
                               rec.title.includes('DMARC') ? '$200-800/month' :
                               rec.title.includes('MX') ? 'All email revenue' : '$100-500/month'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 p-6 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl">
                  <h3 className="text-cyan-300 font-semibold mb-2">🚀 Need Help Implementing These Fixes?</h3>
                  <p className="text-gray-300 text-sm mb-4">
                    Our team specializes in email deliverability optimization. We can implement these recommendations 
                    and help you recover the lost revenue within 2-4 weeks.
                  </p>
                  <button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105">
                    Get Expert Help
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Revenue Calculator Component
const RevenueCalculator = () => {
  const [formData, setFormData] = React.useState({
    monthlyRevenue: '',
    industry: 'general',
    hasEmailMarketing: false,
    hasSMSMarketing: false,
    currentEmailRevenue: '',
    currentSMSRevenue: ''
  });
  const [results, setResults] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const industries = {
    general: { name: 'General E-commerce', emailROI: 20, smsROI: 15 },
    fashion: { name: 'Fashion & Apparel', emailROI: 25, smsROI: 20 },
    beauty: { name: 'Beauty & Cosmetics', emailROI: 30, smsROI: 25 },
    electronics: { name: 'Electronics', emailROI: 18, smsROI: 12 },
    home: { name: 'Home & Garden', emailROI: 22, smsROI: 16 },
    food: { name: 'Food & Beverage', emailROI: 28, smsROI: 22 }
  };

  const Tooltip = ({ text, children }) => {
    const [show, setShow] = React.useState(false);
    
    return (
      <div className="relative inline-block">
        <div
          onMouseEnter={() => setShow(true)}
          onMouseLeave={() => setShow(false)}
          className="cursor-help"
        >
          {children}
        </div>
        {show && (
          <div className="absolute z-10 w-64 p-3 text-sm text-white bg-slate-800 border border-slate-600 rounded-lg shadow-lg -top-2 left-full ml-2">
            <div className="absolute w-2 h-2 bg-slate-800 border-l border-t border-slate-600 transform rotate-45 -left-1 top-4"></div>
            {text}
          </div>
        )}
      </div>
    );
  };

  const calculateRevenue = async () => {
    if (!formData.monthlyRevenue) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/calculate-revenue`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          monthly_revenue: parseFloat(formData.monthlyRevenue),
          industry: formData.industry,
          has_email_marketing: formData.hasEmailMarketing,
          has_sms_marketing: formData.hasSMSMarketing,
          current_email_revenue: parseFloat(formData.currentEmailRevenue) || 0,
          current_sms_revenue: parseFloat(formData.currentSMSRevenue) || 0
        }),
      });
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error calculating revenue:', error);
    }
    setLoading(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Revenue Calculator
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Get accurate revenue projections based on your current performance and industry benchmarks.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Business Information</h2>
            
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <label className="block text-white font-semibold">Total Monthly Revenue ($)</label>
                  <Tooltip text="Your total monthly revenue from all sources. This is used as the baseline to calculate marketing potential.">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </Tooltip>
                </div>
                <input
                  type="number"
                  value={formData.monthlyRevenue}
                  onChange={(e) => handleInputChange('monthlyRevenue', e.target.value)}
                  placeholder="e.g., 50000"
                  className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <label className="block text-white font-semibold">Industry</label>
                  <Tooltip text="Different industries have different email marketing performance benchmarks. Select your primary industry for accurate projections.">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </Tooltip>
                </div>
                <select
                  value={formData.industry}
                  onChange={(e) => handleInputChange('industry', e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                >
                  {Object.entries(industries).map(([key, industry]) => (
                    <option key={key} value={key}>
                      {industry.name} (Email: {industry.emailROI}%, SMS: {industry.smsROI}%)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white font-semibold mb-3">Current Marketing Channels</label>
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        checked={formData.hasEmailMarketing}
                        onChange={(e) => handleInputChange('hasEmailMarketing', e.target.checked)}
                        className="w-5 h-5 text-cyan-500 bg-slate-700 border-slate-600 rounded focus:ring-cyan-400 focus:ring-2"
                      />
                      <span className="ml-3 text-gray-300">I currently use email marketing</span>
                    </label>
                    {formData.hasEmailMarketing && (
                      <div className="ml-8">
                        <div className="flex items-center gap-2 mb-2">
                          <label className="text-sm text-gray-400">Current monthly email revenue ($)</label>
                          <Tooltip text="How much revenue do you currently generate from email marketing per month? Be as accurate as possible for better projections.">
                            <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </Tooltip>
                        </div>
                        <input
                          type="number"
                          value={formData.currentEmailRevenue}
                          onChange={(e) => handleInputChange('currentEmailRevenue', e.target.value)}
                          placeholder="e.g., 5000"
                          className="w-full bg-slate-600 border border-slate-500 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        checked={formData.hasSMSMarketing}
                        onChange={(e) => handleInputChange('hasSMSMarketing', e.target.checked)}
                        className="w-5 h-5 text-cyan-500 bg-slate-700 border-slate-600 rounded focus:ring-cyan-400 focus:ring-2"
                      />
                      <span className="ml-3 text-gray-300">I currently use SMS marketing</span>
                    </label>
                    {formData.hasSMSMarketing && (
                      <div className="ml-8">
                        <div className="flex items-center gap-2 mb-2">
                          <label className="text-sm text-gray-400">Current monthly SMS revenue ($)</label>
                          <Tooltip text="How much revenue do you currently generate from SMS marketing per month? Include all SMS-driven sales and conversions.">
                            <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </Tooltip>
                        </div>
                        <input
                          type="number"
                          value={formData.currentSMSRevenue}
                          onChange={(e) => handleInputChange('currentSMSRevenue', e.target.value)}
                          placeholder="e.g., 2000"
                          className="w-full bg-slate-600 border border-slate-500 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={calculateRevenue}
                disabled={!formData.monthlyRevenue || loading}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:opacity-50 text-white py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
              >
                {loading ? 'Calculating...' : 'Calculate Revenue Potential'}
              </button>
            </div>
          </div>

          {/* Results */}
          {results && (
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Revenue Projections</h2>
              
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-gray-400 mb-2">Current Monthly Revenue</p>
                  <p className="text-3xl font-bold text-white">${results.current_monthly.toLocaleString()}</p>
                </div>

                {/* Current Performance */}
                {(results.current_email_revenue > 0 || results.current_sms_revenue > 0) && (
                  <div className="border-t border-slate-600 pt-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Current Marketing Performance</h3>
                    <div className="space-y-2">
                      {results.current_email_revenue > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300">Current Email Revenue</span>
                          <span className="text-cyan-400 font-semibold">${results.current_email_revenue.toLocaleString()}/mo</span>
                        </div>
                      )}
                      {results.current_sms_revenue > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300">Current SMS Revenue</span>
                          <span className="text-orange-400 font-semibold">${results.current_sms_revenue.toLocaleString()}/mo</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Potential Increases */}
                <div className="border-t border-slate-600 pt-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Additional Revenue Potential</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-300">Email Marketing</span>
                        <Tooltip text={results.calculation_breakdown.explanation.email}>
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </Tooltip>
                      </div>
                      <div className="text-right">
                        <div className="text-cyan-400 font-semibold">+${results.email_potential.toLocaleString()}/mo</div>
                        <div className="text-xs text-gray-400">
                          Max: ${results.calculation_breakdown.max_potential.email.toLocaleString()}
                        </div>
                        {results.email_potential > 0 && (
                          <div className="text-xs text-cyan-300 mt-1">
                            {!formData.hasEmailMarketing ? 
                              "By implementing email marketing" : 
                              "By optimizing current email setup"}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-300">SMS Marketing</span>
                        <Tooltip text={results.calculation_breakdown.explanation.sms}>
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </Tooltip>
                      </div>
                      <div className="text-right">
                        <div className="text-orange-400 font-semibold">+${results.sms_potential.toLocaleString()}/mo</div>
                        <div className="text-xs text-gray-400">
                          Max: ${results.calculation_breakdown.max_potential.sms.toLocaleString()}
                        </div>
                        {results.sms_potential > 0 && (
                          <div className="text-xs text-orange-300 mt-1">
                            {!formData.hasSMSMarketing ? 
                              "By implementing SMS marketing" : 
                              "By optimizing current SMS setup"}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Required Section */}
                {(results.email_potential > 0 || results.sms_potential > 0) && (
                  <div className="border-t border-slate-600 pt-6">
                    <h3 className="text-lg font-semibold text-white mb-4">🎯 How to Achieve This Revenue</h3>
                    <div className="space-y-3">
                      {results.email_potential > 0 && (
                        <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="text-cyan-300 font-semibold mb-2">
                                Email Marketing: +${results.email_potential.toLocaleString()}/month
                              </h4>
                              <p className="text-cyan-100 text-sm">
                                {!formData.hasEmailMarketing ? 
                                  "Start sending targeted email campaigns, automated welcome series, abandoned cart recovery, and product recommendations." :
                                  "Optimize your current email strategy with better segmentation, personalization, and automated flows to reach industry benchmarks."}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {results.sms_potential > 0 && (
                        <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="text-orange-300 font-semibold mb-2">
                                SMS Marketing: +${results.sms_potential.toLocaleString()}/month
                              </h4>
                              <p className="text-orange-100 text-sm">
                                {!formData.hasSMSMarketing ? 
                                  "Launch SMS campaigns for flash sales, order updates, abandoned cart recovery, and exclusive offers to your subscriber base." :
                                  "Enhance your SMS strategy with better timing, personalized messaging, and advanced automation to maximize conversion rates."}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Total Potential */}
                <div className="border-t border-slate-600 pt-6">
                  <div className="text-center">
                    <p className="text-gray-400 mb-2">Total Additional Monthly Revenue</p>
                    <p className="text-4xl font-bold text-green-400">+${results.total_monthly_increase.toLocaleString()}</p>
                  </div>
                </div>

                {/* Annual Projection */}
                <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-6">
                  <div className="text-center">
                    <p className="text-green-300 font-semibold mb-2">Annual Revenue Potential</p>
                    <p className="text-3xl font-bold text-green-400">${results.annual_potential.toLocaleString()}</p>
                    <p className="text-green-200 text-sm mt-2">Based on {results.industry} industry benchmarks</p>
                  </div>
                </div>

                {/* Calculation Details */}
                <div className="bg-slate-700/50 rounded-xl p-4">
                  <h4 className="text-white font-semibold mb-3">How We Calculate This</h4>
                  <div className="text-sm text-gray-300 space-y-2">
                    <p><strong>Industry Benchmarks ({results.industry}):</strong></p>
                    <p>• Email Marketing: {results.calculation_breakdown.industry_benchmarks.email_roi_percent}% of total revenue</p>
                    <p>• SMS Marketing: {results.calculation_breakdown.industry_benchmarks.sms_roi_percent}% of total revenue</p>
                    <p className="pt-2"><strong>Your Potential:</strong></p>
                    <p>• Email: ${results.calculation_breakdown.max_potential.email.toLocaleString()} maximum - ${results.calculation_breakdown.current_performance.email.toLocaleString()} current = ${results.email_potential.toLocaleString()} additional</p>
                    <p>• SMS: ${results.calculation_breakdown.max_potential.sms.toLocaleString()} maximum - ${results.calculation_breakdown.current_performance.sms.toLocaleString()} current = ${results.sms_potential.toLocaleString()} additional</p>
                  </div>
                </div>

                <div className="bg-slate-700/50 rounded-xl p-4">
                  <p className="text-gray-300 text-sm">
                    <strong className="text-white">Note:</strong> These projections are based on industry averages and your inputs. 
                    Actual results depend on execution quality, audience engagement, and market conditions. 
                    Start with email marketing for the highest ROI potential.
                  </p>
                </div>

                {/* Book a Call CTA */}
                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6 text-center">
                  <h3 className="text-purple-300 font-semibold mb-2">🚀 Ready to Achieve This Revenue Growth?</h3>
                  <p className="text-gray-300 text-sm mb-4">
                    Our email and SMS marketing experts can help you implement these strategies and achieve your revenue goals within 60-90 days.
                  </p>
                  <a 
                    href="https://www.etptech.com/contact" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
                  >
                    Book a Strategy Call
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Navigation Component
const Navigation = () => {
  const location = useLocation();
  
  return (
    <nav className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-center">
          <div className="flex space-x-8">
            <Link
              to="/"
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                location.pathname === '/' 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25' 
                  : 'text-gray-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              Home
            </Link>
            <Link
              to="/deliverability"
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                location.pathname === '/deliverability' 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25' 
                  : 'text-gray-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              Deliverability
            </Link>
            <Link
              to="/calculator"
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                location.pathname === '/calculator' 
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/25' 
                  : 'text-gray-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              Calculator
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Main App Component
const App = () => {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/deliverability" element={<DeliverabilityChecker />} />
          <Route path="/calculator" element={<RevenueCalculator />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;