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
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center transform hover:scale-105 transition-transform">
              <div className="text-white font-bold text-2xl">E</div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              EMBRACE
            </h1>
            <p className="text-orange-400 text-xl font-semibold tracking-wider">
              THE POTENTIAL
            </p>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Maximize Your E-commerce Email Marketing
          </h2>
          <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto mb-12">
            Check your email deliverability health, get actionable recommendations, 
            and discover your revenue potential with our powerful marketing tools.
          </p>
        </div>

        {/* Tool Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Link to="/deliverability" className="group">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 hover:border-cyan-400 transition-all duration-300 transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center mb-6 group-hover:shadow-lg group-hover:shadow-cyan-400/25">
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
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 hover:border-orange-400 transition-all duration-300 transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center mb-6 group-hover:shadow-lg group-hover:shadow-orange-400/25">
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

  const checkDeliverability = async () => {
    if (!domain) return;
    
    setLoading(true);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Email Deliverability Checker
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Enter your domain to analyze your email setup and get actionable recommendations to improve deliverability.
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
                className="flex-1 bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              />
              <button
                onClick={checkDeliverability}
                disabled={loading || !domain}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
              >
                {loading ? 'Checking...' : 'Check Health'}
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {results && (
          <div className="max-w-4xl mx-auto">
            {/* Overall Score */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 mb-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-6">Deliverability Health Score</h2>
                <div className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-br ${getScoreBg(results.overall_score)} flex items-center justify-center mb-6`}>
                  <span className="text-3xl font-bold text-white">{results.overall_score}</span>
                </div>
                <p className={`text-xl font-semibold ${getScoreColor(results.overall_score)} mb-4`}>
                  {results.overall_score >= 80 ? 'Excellent' : results.overall_score >= 60 ? 'Good' : 'Needs Improvement'}
                </p>
                <p className="text-gray-300">{results.summary}</p>
              </div>
            </div>

            {/* Detailed Results */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {results.checks.map((check, index) => (
                <div key={index} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">{check.name}</h3>
                    <div className={`w-3 h-3 rounded-full ${check.passed ? 'bg-green-400' : 'bg-red-400'}`}></div>
                  </div>
                  <p className="text-gray-400 text-sm mb-3">{check.description}</p>
                  <p className={`text-sm ${check.passed ? 'text-green-400' : 'text-red-400'}`}>
                    {check.result}
                  </p>
                </div>
              ))}
            </div>

            {/* Recommendations */}
            {results.recommendations.length > 0 && (
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Recommendations</h2>
                <div className="space-y-4">
                  {results.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-sm font-bold">{index + 1}</span>
                      </div>
                      <div>
                        <h3 className="text-white font-semibold mb-2">{rec.title}</h3>
                        <p className="text-gray-400">{rec.description}</p>
                      </div>
                    </div>
                  ))}
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
    emailListSize: '',
    emailFrequency: 'weekly'
  });
  const [results, setResults] = React.useState(null);

  const industries = {
    general: { name: 'General E-commerce', emailROI: 20, smsROI: 15 },
    fashion: { name: 'Fashion & Apparel', emailROI: 25, smsROI: 20 },
    beauty: { name: 'Beauty & Cosmetics', emailROI: 30, smsROI: 25 },
    electronics: { name: 'Electronics', emailROI: 18, smsROI: 12 },
    home: { name: 'Home & Garden', emailROI: 22, smsROI: 16 },
    food: { name: 'Food & Beverage', emailROI: 28, smsROI: 22 }
  };

  const calculateRevenue = () => {
    if (!formData.monthlyRevenue) return;

    const monthlyRev = parseFloat(formData.monthlyRevenue);
    const industry = industries[formData.industry];
    
    // Calculate potential revenue increases
    const emailPotential = formData.hasEmailMarketing ? 
      monthlyRev * (industry.emailROI / 100) * 0.3 : // 30% improvement if already using
      monthlyRev * (industry.emailROI / 100); // Full potential if not using

    const smsPotential = formData.hasSMSMarketing ?
      monthlyRev * (industry.smsROI / 100) * 0.3 :
      monthlyRev * (industry.smsROI / 100);

    const totalPotential = emailPotential + smsPotential;
    const annualPotential = totalPotential * 12;

    setResults({
      current: monthlyRev,
      emailPotential,
      smsPotential,
      totalMonthly: totalPotential,
      totalAnnual: annualPotential,
      industry: industry.name
    });
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
            Discover your potential revenue increase with strategic email and SMS marketing campaigns.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Business Information</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-white font-semibold mb-2">Monthly Revenue ($)</label>
                <input
                  type="number"
                  value={formData.monthlyRevenue}
                  onChange={(e) => handleInputChange('monthlyRevenue', e.target.value)}
                  placeholder="e.g., 50000"
                  className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Industry</label>
                <select
                  value={formData.industry}
                  onChange={(e) => handleInputChange('industry', e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                >
                  {Object.entries(industries).map(([key, industry]) => (
                    <option key={key} value={key}>{industry.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white font-semibold mb-3">Current Marketing</label>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.hasEmailMarketing}
                      onChange={(e) => handleInputChange('hasEmailMarketing', e.target.checked)}
                      className="w-5 h-5 text-cyan-500 bg-slate-700 border-slate-600 rounded focus:ring-cyan-400 focus:ring-2"
                    />
                    <span className="ml-3 text-gray-300">I currently use email marketing</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.hasSMSMarketing}
                      onChange={(e) => handleInputChange('hasSMSMarketing', e.target.checked)}
                      className="w-5 h-5 text-cyan-500 bg-slate-700 border-slate-600 rounded focus:ring-cyan-400 focus:ring-2"
                    />
                    <span className="ml-3 text-gray-300">I currently use SMS marketing</span>
                  </label>
                </div>
              </div>

              <button
                onClick={calculateRevenue}
                disabled={!formData.monthlyRevenue}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:opacity-50 text-white py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
              >
                Calculate Revenue Potential
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
                  <p className="text-3xl font-bold text-white">${results.current.toLocaleString()}</p>
                </div>

                <div className="border-t border-slate-600 pt-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Email Marketing Potential</span>
                      <span className="text-cyan-400 font-semibold">+${results.emailPotential.toLocaleString()}/mo</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">SMS Marketing Potential</span>
                      <span className="text-orange-400 font-semibold">+${results.smsPotential.toLocaleString()}/mo</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-600 pt-6">
                  <div className="text-center">
                    <p className="text-gray-400 mb-2">Total Monthly Increase</p>
                    <p className="text-4xl font-bold text-green-400">+${results.totalMonthly.toLocaleString()}</p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-6">
                  <div className="text-center">
                    <p className="text-green-300 font-semibold mb-2">Annual Revenue Potential</p>
                    <p className="text-3xl font-bold text-green-400">${results.totalAnnual.toLocaleString()}</p>
                    <p className="text-green-200 text-sm mt-2">Based on {results.industry} industry averages</p>
                  </div>
                </div>

                <div className="bg-slate-700/50 rounded-xl p-4">
                  <p className="text-gray-300 text-sm">
                    <strong className="text-white">Note:</strong> Results are estimates based on industry benchmarks. 
                    Actual results may vary depending on implementation, audience, and execution quality.
                  </p>
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
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">E</span>
            </div>
            <span className="text-white font-bold text-xl">EMBRACE</span>
          </Link>
          
          <div className="flex space-x-6">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg transition-colors ${
                location.pathname === '/' 
                  ? 'bg-cyan-500 text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              Home
            </Link>
            <Link
              to="/deliverability"
              className={`px-4 py-2 rounded-lg transition-colors ${
                location.pathname === '/deliverability' 
                  ? 'bg-cyan-500 text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              Deliverability
            </Link>
            <Link
              to="/calculator"
              className={`px-4 py-2 rounded-lg transition-colors ${
                location.pathname === '/calculator' 
                  ? 'bg-orange-500 text-white' 
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