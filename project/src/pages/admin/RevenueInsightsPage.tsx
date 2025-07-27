import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Users, DollarSign, Activity, Calendar } from 'lucide-react';

interface RevenueData {
  totalRevenue: number;
  monthlyRevenue: number;
  totalUsers: number;
  activeUsers: number;
  totalTransactions: number;
  averageTransactionValue: number;
  growthRate: number;
  topPerformingPlans: Array<{
    name: string;
    revenue: number;
    users: number;
  }>;
  monthlyData: Array<{
    month: string;
    revenue: number;
    users: number;
    transactions: number;
  }>;
}

const RevenueInsightsPage: React.FC = () => {
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRevenueData();
  }, [selectedPeriod]);

  const loadRevenueData = () => {
    setLoading(true);
    
    // Simulate loading delay
    setTimeout(() => {
      // In a real app, this would fetch from an API
      const mockData: RevenueData = {
        totalRevenue: 125400.50,
        monthlyRevenue: 18750.25,
        totalUsers: 1247,
        activeUsers: 892,
        totalTransactions: 3456,
        averageTransactionValue: 36.25,
        growthRate: 12.5,
        topPerformingPlans: [
          { name: 'Premium Investment', revenue: 45200, users: 156 },
          { name: 'Basic Savings', revenue: 32100, users: 423 },
          { name: 'Gold Package', revenue: 28900, users: 89 },
          { name: 'Starter Plan', revenue: 19200, users: 579 }
        ],
        monthlyData: [
          { month: 'Jan', revenue: 15200, users: 120, transactions: 245 },
          { month: 'Feb', revenue: 16800, users: 135, transactions: 267 },
          { month: 'Mar', revenue: 18200, users: 148, transactions: 289 },
          { month: 'Apr', revenue: 17600, users: 142, transactions: 278 },
          { month: 'May', revenue: 19400, users: 156, transactions: 312 },
          { month: 'Jun', revenue: 18750, users: 151, transactions: 298 }
        ]
      };
      
      setRevenueData(mockData);
      setLoading(false);
    }, 1000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  if (loading || !revenueData) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Revenue Insights Dashboard</h1>
        <div className="flex items-center gap-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(revenueData.totalRevenue)}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="text-green-500" size={16} />
                <span className="text-green-600 text-sm ml-1">{formatPercentage(revenueData.growthRate)}</span>
              </div>
            </div>
            <DollarSign className="text-blue-500" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(revenueData.monthlyRevenue)}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="text-green-500" size={16} />
                <span className="text-green-600 text-sm ml-1">+8.2%</span>
              </div>
            </div>
            <Calendar className="text-green-500" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{revenueData.totalUsers.toLocaleString()}</p>
              <div className="flex items-center mt-2">
                <span className="text-gray-600 text-sm">{revenueData.activeUsers} active</span>
              </div>
            </div>
            <Users className="text-purple-500" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Transaction</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(revenueData.averageTransactionValue)}</p>
              <div className="flex items-center mt-2">
                <span className="text-gray-600 text-sm">{revenueData.totalTransactions} total</span>
              </div>
            </div>
            <Activity className="text-orange-500" size={32} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Monthly Revenue Trend</h2>
          <div className="h-64 flex items-end justify-between space-x-2">
            {revenueData.monthlyData.map((data, index) => (
              <div key={data.month} className="flex flex-col items-center flex-1">
                <div
                  className="bg-blue-500 rounded-t w-full transition-all duration-300 hover:bg-blue-600"
                  style={{
                    height: `${(data.revenue / Math.max(...revenueData.monthlyData.map(d => d.revenue))) * 200}px`,
                    minHeight: '20px'
                  }}
                  title={`${data.month}: ${formatCurrency(data.revenue)}`}
                ></div>
                <span className="text-xs text-gray-600 mt-2">{data.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Plans */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Top Performing Plans</h2>
          <div className="space-y-4">
            {revenueData.topPerformingPlans.map((plan, index) => (
              <div key={plan.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{plan.name}</p>
                    <p className="text-sm text-gray-600">{plan.users} users</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{formatCurrency(plan.revenue)}</p>
                  <p className="text-sm text-gray-600">
                    {formatCurrency(plan.revenue / plan.users)} avg/user
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Growth Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">User Growth</h2>
          <div className="h-64 flex items-end justify-between space-x-2">
            {revenueData.monthlyData.map((data, index) => (
              <div key={data.month} className="flex flex-col items-center flex-1">
                <div
                  className="bg-green-500 rounded-t w-full transition-all duration-300 hover:bg-green-600"
                  style={{
                    height: `${(data.users / Math.max(...revenueData.monthlyData.map(d => d.users))) * 200}px`,
                    minHeight: '20px'
                  }}
                  title={`${data.month}: ${data.users} users`}
                ></div>
                <span className="text-xs text-gray-600 mt-2">{data.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Transaction Volume */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Transaction Volume</h2>
          <div className="h-64 flex items-end justify-between space-x-2">
            {revenueData.monthlyData.map((data, index) => (
              <div key={data.month} className="flex flex-col items-center flex-1">
                <div
                  className="bg-purple-500 rounded-t w-full transition-all duration-300 hover:bg-purple-600"
                  style={{
                    height: `${(data.transactions / Math.max(...revenueData.monthlyData.map(d => d.transactions))) * 200}px`,
                    minHeight: '20px'
                  }}
                  title={`${data.month}: ${data.transactions} transactions`}
                ></div>
                <span className="text-xs text-gray-600 mt-2">{data.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Key Performance Indicators</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {((revenueData.activeUsers / revenueData.totalUsers) * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">User Engagement Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {formatCurrency(revenueData.totalRevenue / revenueData.totalUsers)}
            </div>
            <div className="text-sm text-gray-600">Revenue per User</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {(revenueData.totalTransactions / revenueData.totalUsers).toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">Transactions per User</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueInsightsPage;
