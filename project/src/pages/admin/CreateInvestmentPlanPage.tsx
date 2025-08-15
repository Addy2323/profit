import React, { useState } from 'react';
import {
  PlusIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowLeftIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

interface InvestmentPlan {
  name: string;
  description: string;
  minAmount: number;
  maxAmount: number;
  dailyReturn: number;
  duration: number;
  category: 'basic' | 'premium' | 'vip' | 'custom';
  features: string[];
  riskLevel: 'low' | 'medium' | 'high';
  status: 'active' | 'draft' | 'paused';
  autoRenewal: boolean;
  earlyWithdrawal: boolean;
  compoundInterest: boolean;
}

const CreateInvestmentPlanPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [plan, setPlan] = useState<InvestmentPlan>({
    name: '',
    description: '',
    minAmount: 10000,
    maxAmount: 100000,
    dailyReturn: 5,
    duration: 30,
    category: 'basic',
    features: [],
    riskLevel: 'low',
    status: 'draft',
    autoRenewal: false,
    earlyWithdrawal: false,
    compoundInterest: false
  });

  const [newFeature, setNewFeature] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!plan.name.trim()) {
      newErrors.name = 'Plan name is required';
    }

    if (!plan.description.trim()) {
      newErrors.description = 'Plan description is required';
    }

    if (plan.minAmount <= 0) {
      newErrors.minAmount = 'Minimum amount must be greater than 0';
    }

    if (plan.maxAmount <= plan.minAmount) {
      newErrors.maxAmount = 'Maximum amount must be greater than minimum amount';
    }

    if (plan.dailyReturn <= 0 || plan.dailyReturn > 50) {
      newErrors.dailyReturn = 'Daily return must be between 0.1% and 50%';
    }

    if (plan.duration <= 0 || plan.duration > 365) {
      newErrors.duration = 'Duration must be between 1 and 365 days';
    }

    if (plan.features.length === 0) {
      newErrors.features = 'At least one feature is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Save to localStorage (in real app, this would be an API call)
      const existingPlans = JSON.parse(localStorage.getItem('profitnet_investment_plans') || '[]');
      const newPlan = {
        ...plan,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        totalInvested: 0,
        activeInvestors: 0,
        totalReturns: 0
      };
      
      existingPlans.push(newPlan);
      localStorage.setItem('profitnet_investment_plans', JSON.stringify(existingPlans));
      
      // Show success message and redirect
      alert('Investment plan created successfully!');
      navigate('/admin/investment-analytics');
      
    } catch (error) {
      console.error('Error creating plan:', error);
      alert('Error creating investment plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addFeature = () => {
    if (newFeature.trim() && !plan.features.includes(newFeature.trim())) {
      setPlan(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (feature: string) => {
    setPlan(prev => ({
      ...prev,
      features: prev.features.filter(f => f !== feature)
    }));
  };

  const calculateProjectedReturns = () => {
    const principal = plan.minAmount;
    const dailyRate = plan.dailyReturn / 100;
    const totalReturn = plan.compoundInterest 
      ? principal * Math.pow(1 + dailyRate, plan.duration)
      : principal + (principal * dailyRate * plan.duration);
    
    return totalReturn - principal;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'basic': return 'text-blue-600 bg-blue-100';
      case 'premium': return 'text-purple-600 bg-purple-100';
      case 'vip': return 'text-yellow-600 bg-yellow-100';
      case 'custom': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (showPreview) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={() => setShowPreview(false)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              Back to Edit
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Plan Preview</h1>
          </div>

          {/* Preview Card */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
                  <p className="text-blue-100">{plan.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">{plan.dailyReturn}%</div>
                  <div className="text-sm text-blue-100">Daily Return</div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Minimum Investment:</span>
                    <span className="font-semibold">{formatCurrency(plan.minAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Maximum Investment:</span>
                    <span className="font-semibold">{formatCurrency(plan.maxAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-semibold">{plan.duration} days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Risk Level:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getRiskColor(plan.riskLevel)}`}>
                      {plan.riskLevel.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Category:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getCategoryColor(plan.category)}`}>
                      {plan.category.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Auto Renewal:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${plan.autoRenewal ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {plan.autoRenewal ? 'YES' : 'NO'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Early Withdrawal:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${plan.earlyWithdrawal ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {plan.earlyWithdrawal ? 'ALLOWED' : 'NOT ALLOWED'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Compound Interest:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${plan.compoundInterest ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {plan.compoundInterest ? 'YES' : 'NO'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Plan Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircleIcon className="h-5 w-5 text-green-500" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Projected Returns</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{formatCurrency(plan.minAmount)}</div>
                    <div className="text-sm text-gray-600">Initial Investment</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{formatCurrency(calculateProjectedReturns())}</div>
                    <div className="text-sm text-gray-600">Total Returns</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{formatCurrency(plan.minAmount + calculateProjectedReturns())}</div>
                    <div className="text-sm text-gray-600">Final Amount</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creating Plan...
                </>
              ) : (
                <>
                  <PlusIcon className="h-5 w-5" />
                  Create Investment Plan
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🚀 Create Investment Plan</h1>
          <p className="text-gray-600">Design a new investment plan with custom features and returns</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plan Name *
                </label>
                <input
                  type="text"
                  value={plan.name}
                  onChange={(e) => setPlan(prev => ({ ...prev, name: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Premium Investment Plan"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={plan.category}
                  onChange={(e) => setPlan(prev => ({ ...prev, category: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="basic">Basic</option>
                  <option value="premium">Premium</option>
                  <option value="vip">VIP</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={plan.description}
                onChange={(e) => setPlan(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Describe the investment plan benefits and features..."
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>
          </div>

          {/* Investment Parameters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Investment Parameters</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Amount (TZS) *
                </label>
                <div className="relative">
                  <CurrencyDollarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    value={plan.minAmount}
                    onChange={(e) => setPlan(prev => ({ ...prev, minAmount: Number(e.target.value) }))}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.minAmount ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="10000"
                  />
                </div>
                {errors.minAmount && <p className="mt-1 text-sm text-red-600">{errors.minAmount}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Amount (TZS) *
                </label>
                <div className="relative">
                  <CurrencyDollarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    value={plan.maxAmount}
                    onChange={(e) => setPlan(prev => ({ ...prev, maxAmount: Number(e.target.value) }))}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.maxAmount ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="100000"
                  />
                </div>
                {errors.maxAmount && <p className="mt-1 text-sm text-red-600">{errors.maxAmount}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Daily Return (%) *
                </label>
                <div className="relative">
                  <ChartBarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    step="0.1"
                    value={plan.dailyReturn}
                    onChange={(e) => setPlan(prev => ({ ...prev, dailyReturn: Number(e.target.value) }))}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.dailyReturn ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="5.0"
                  />
                </div>
                {errors.dailyReturn && <p className="mt-1 text-sm text-red-600">{errors.dailyReturn}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (Days) *
                </label>
                <div className="relative">
                  <CalendarDaysIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    value={plan.duration}
                    onChange={(e) => setPlan(prev => ({ ...prev, duration: Number(e.target.value) }))}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.duration ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="30"
                  />
                </div>
                {errors.duration && <p className="mt-1 text-sm text-red-600">{errors.duration}</p>}
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Risk Level
              </label>
              <select
                value={plan.riskLevel}
                onChange={(e) => setPlan(prev => ({ ...prev, riskLevel: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="low">Low Risk</option>
                <option value="medium">Medium Risk</option>
                <option value="high">High Risk</option>
              </select>
            </div>
          </div>

          {/* Plan Features */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Plan Features</h2>
            
            <div className="mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add a feature (e.g., Daily profit withdrawal)"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                />
                <button
                  type="button"
                  onClick={addFeature}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add
                </button>
              </div>
              {errors.features && <p className="mt-1 text-sm text-red-600">{errors.features}</p>}
            </div>

            <div className="space-y-2">
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFeature(feature)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Options */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Additional Options</h2>
            
            <div className="space-y-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={plan.autoRenewal}
                  onChange={(e) => setPlan(prev => ({ ...prev, autoRenewal: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">Enable auto-renewal</span>
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={plan.earlyWithdrawal}
                  onChange={(e) => setPlan(prev => ({ ...prev, earlyWithdrawal: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">Allow early withdrawal</span>
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={plan.compoundInterest}
                  onChange={(e) => setPlan(prev => ({ ...prev, compoundInterest: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">Enable compound interest</span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              Cancel
            </button>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowPreview(true)}
                className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2"
              >
                <EyeIcon className="h-5 w-5" />
                Preview
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <PlusIcon className="h-5 w-5" />
                    Create Plan
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInvestmentPlanPage;
