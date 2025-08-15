import React, { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  UsersIcon,
  CalendarDaysIcon,
  ArrowPathIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

interface InvestmentPlan {
  id: string;
  name: string;
  minAmount: number;
  maxAmount: number;
  dailyReturn: number;
  duration: number;
  totalInvested: number;
  activeInvestors: number;
  totalReturns: number;
  status: 'active' | 'paused' | 'completed';
  createdAt: string;
}

interface InvestmentStats {
  totalPlans: number;
  totalInvested: number;
  totalReturns: number;
  activeInvestors: number;
  monthlyGrowth: number;
  avgDailyReturn: number;
}

const InvestmentAnalyticsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<InvestmentStats>({
    totalPlans: 0,
    totalInvested: 0,
    totalReturns: 0,
    activeInvestors: 0,
    monthlyGrowth: 0,
    avgDailyReturn: 0
  });
  const [plans, setPlans] = useState<InvestmentPlan[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  // Sample data for charts
  const monthlyData = [
    { month: 'Jan', invested: 120000, returns: 8400, investors: 45 },
    { month: 'Feb', invested: 180000, returns: 12600, investors: 67 },
    { month: 'Mar', invested: 250000, returns: 17500, investors: 89 },
    { month: 'Apr', invested: 320000, returns: 22400, investors: 112 },
    { month: 'May', invested: 410000, returns: 28700, investors: 134 },
    { month: 'Jun', invested: 520000, returns: 36400, investors: 156 }
  ];

  const planDistribution = [
    { name: 'Basic Plan', value: 35, color: '#3B82F6' },
    { name: 'Premium Plan', value: 45, color: '#10B981' },
    { name: 'VIP Plan', value: 20, color: '#F59E0B' }
  ];

  const performanceData = [
    { plan: 'Basic', target: 7, actual: 7.2, investors: 45 },
    { plan: 'Premium', target: 12, actual: 11.8, investors: 67 },
    { plan: 'VIP', target: 18, actual: 19.1, investors: 23 }
  ];

  useEffect(() => {
    loadAnalytics();
  }, [selectedPeriod]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Load from localStorage or use sample data
      const savedPlans = localStorage.getItem('profitnet_investment_plans');
      const investmentPlans: InvestmentPlan[] = savedPlans ? JSON.parse(savedPlans) : [
        {
          id: '1',
          name: 'Basic Investment Plan',
          minAmount: 10000,
          maxAmount: 100000,
          dailyReturn: 7,
          duration: 30,
          totalInvested: 2500000,
          activeInvestors: 45,
          totalReturns: 175000,
          status: 'active',
          createdAt: '2024-01-15'
        },
        {
          id: '2',
          name: 'Premium Investment Plan',
          minAmount: 100000,
          maxAmount: 500000,
          dailyReturn: 12,
          duration: 60,
          totalInvested: 8200000,
          activeInvestors: 67,
          totalReturns: 984000,
          status: 'active',
          createdAt: '2024-02-01'
        },
        {
          id: '3',
          name: 'VIP Investment Plan',
          minAmount: 500000,
          maxAmount: 2000000,
          dailyReturn: 18,
          duration: 90,
          totalInvested: 15600000,
          activeInvestors: 23,
          totalReturns: 2808000,
          status: 'active',
          createdAt: '2024-03-10'
        }
      ];

      setPlans(investmentPlans);

      // Calculate stats
      const totalInvested = investmentPlans.reduce((sum, plan) => sum + plan.totalInvested, 0);
      const totalReturns = investmentPlans.reduce((sum, plan) => sum + plan.totalReturns, 0);
      const activeInvestors = investmentPlans.reduce((sum, plan) => sum + plan.activeInvestors, 0);
      const avgDailyReturn = investmentPlans.reduce((sum, plan) => sum + plan.dailyReturn, 0) / investmentPlans.length;

      setStats({
        totalPlans: investmentPlans.length,
        totalInvested,
        totalReturns,
        activeInvestors,
        monthlyGrowth: 15.4,
        avgDailyReturn
      });

    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ArrowPathIcon className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading investment analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">📊 Investment Analytics</h1>
          <p className="text-gray-600">Comprehensive analysis of investment performance and trends</p>
        </div>

        {/* Period Selector */}
        <div className="mb-6">
          <div className="flex space-x-2">
            {(['7d', '30d', '90d', '1y'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedPeriod === period
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {period === '7d' ? '7 Days' : period === '30d' ? '30 Days' : period === '90d' ? '90 Days' : '1 Year'}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Invested</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalInvested)}</p>
                <p className="text-xs text-green-600 mt-1">↗️ +{stats.monthlyGrowth}% this month</p>
              </div>
              <CurrencyDollarIcon className="h-12 w-12 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Returns</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalReturns)}</p>
                <p className="text-xs text-blue-600 mt-1">💰 Profit generated</p>
              </div>
              <ChevronUpIcon className="h-12 w-12 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Investors</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeInvestors}</p>
                <p className="text-xs text-purple-600 mt-1">👥 Total participants</p>
              </div>
              <UsersIcon className="h-12 w-12 text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Daily Return</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgDailyReturn.toFixed(1)}%</p>
                <p className="text-xs text-orange-600 mt-1">📈 Average rate</p>
              </div>
              <ChartBarIcon className="h-12 w-12 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Growth Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Monthly Investment Growth</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
                <Line type="monotone" dataKey="invested" stroke="#3B82F6" strokeWidth={3} name="Total Invested" />
                <Line type="monotone" dataKey="returns" stroke="#10B981" strokeWidth={3} name="Returns Generated" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Plan Distribution */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🥧 Investment Plan Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={planDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {planDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Performance Comparison */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">⚡ Plan Performance vs Targets</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="plan" />
              <YAxis />
              <Tooltip formatter={(value: number) => `${value}%`} />
              <Legend />
              <Bar dataKey="target" fill="#94A3B8" name="Target Return %" />
              <Bar dataKey="actual" fill="#10B981" name="Actual Return %" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Investment Plans Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">💼 Investment Plans Overview</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Daily Return</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Invested</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Investors</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Returns Generated</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {plans.map((plan) => (
                  <tr key={plan.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{plan.name}</div>
                        <div className="text-sm text-gray-500">{plan.duration} days duration</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-green-600">{plan.dailyReturn}%</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{formatCurrency(plan.totalInvested)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{plan.activeInvestors}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-blue-600">{formatCurrency(plan.totalReturns)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        plan.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : plan.status === 'paused'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {plan.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        <EyeIcon className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentAnalyticsPage;
