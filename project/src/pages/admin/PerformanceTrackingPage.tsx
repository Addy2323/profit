import React, { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  StarIcon,
  CalendarDaysIcon,
  ArrowPathIcon,
  EyeIcon,
  CurrencyDollarIcon,
  UsersIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface PlanPerformance {
  id: string;
  name: string;
  targetReturn: number;
  actualReturn: number;
  variance: number;
  totalInvested: number;
  totalReturns: number;
  activeInvestors: number;
  completedCycles: number;
  avgInvestmentSize: number;
  satisfactionScore: number;
  retentionRate: number;
  createdAt: string;
  status: 'active' | 'paused' | 'completed';
}

interface PerformanceMetric {
  name: string;
  current: number;
  target: number;
  previous: number;
  trend: 'up' | 'down' | 'stable';
  unit: string;
}

const PerformanceTrackingPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState<PlanPerformance[]>([]);
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  // Sample performance data over time
  const performanceHistory = [
    { date: '2024-07-01', basic: 7.2, premium: 11.8, vip: 19.1, target: 12.0 },
    { date: '2024-07-08', basic: 7.1, premium: 12.1, vip: 18.9, target: 12.0 },
    { date: '2024-07-15', basic: 7.3, premium: 11.9, vip: 19.3, target: 12.0 },
    { date: '2024-07-22', basic: 7.0, premium: 12.0, vip: 19.0, target: 12.0 },
    { date: '2024-07-29', basic: 7.2, premium: 11.7, vip: 19.2, target: 12.0 },
    { date: '2024-08-05', basic: 7.4, premium: 12.2, vip: 19.4, target: 12.0 }
  ];

  // Radar chart data for plan comparison
  const radarData = [
    { metric: 'Returns', basic: 85, premium: 95, vip: 105 },
    { metric: 'Satisfaction', basic: 90, premium: 88, vip: 92 },
    { metric: 'Retention', basic: 88, premium: 91, vip: 94 },
    { metric: 'Growth', basic: 82, premium: 89, vip: 96 },
    { metric: 'Stability', basic: 95, premium: 87, vip: 78 },
    { metric: 'Profitability', basic: 80, premium: 92, vip: 98 }
  ];

  useEffect(() => {
    loadPerformanceData();
  }, [selectedPlan, selectedPeriod]);

  const loadPerformanceData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Sample plan performance data
      const samplePlans: PlanPerformance[] = [
        {
          id: '1',
          name: 'Basic Investment Plan',
          targetReturn: 7.0,
          actualReturn: 7.2,
          variance: 2.9,
          totalInvested: 2500000,
          totalReturns: 180000,
          activeInvestors: 45,
          completedCycles: 12,
          avgInvestmentSize: 55556,
          satisfactionScore: 4.2,
          retentionRate: 88,
          createdAt: '2024-01-15',
          status: 'active'
        },
        {
          id: '2',
          name: 'Premium Investment Plan',
          targetReturn: 12.0,
          actualReturn: 11.8,
          variance: -1.7,
          totalInvested: 8200000,
          totalReturns: 967600,
          activeInvestors: 67,
          completedCycles: 8,
          avgInvestmentSize: 122388,
          satisfactionScore: 4.4,
          retentionRate: 91,
          createdAt: '2024-02-01',
          status: 'active'
        },
        {
          id: '3',
          name: 'VIP Investment Plan',
          targetReturn: 18.0,
          actualReturn: 19.1,
          variance: 6.1,
          totalInvested: 15600000,
          totalReturns: 2979600,
          activeInvestors: 23,
          completedCycles: 5,
          avgInvestmentSize: 678261,
          satisfactionScore: 4.6,
          retentionRate: 94,
          createdAt: '2024-03-10',
          status: 'active'
        }
      ];

      // Sample performance metrics
      const sampleMetrics: PerformanceMetric[] = [
        {
          name: 'Overall ROI',
          current: 12.7,
          target: 12.0,
          previous: 11.9,
          trend: 'up',
          unit: '%'
        },
        {
          name: 'Customer Satisfaction',
          current: 4.4,
          target: 4.5,
          previous: 4.3,
          trend: 'up',
          unit: '/5'
        },
        {
          name: 'Plan Completion Rate',
          current: 89,
          target: 90,
          previous: 87,
          trend: 'up',
          unit: '%'
        },
        {
          name: 'Average Investment Size',
          current: 285401,
          target: 300000,
          previous: 278500,
          trend: 'up',
          unit: 'TZS'
        },
        {
          name: 'Investor Retention',
          current: 91,
          target: 85,
          previous: 89,
          trend: 'up',
          unit: '%'
        },
        {
          name: 'Revenue Growth',
          current: 15.3,
          target: 12.0,
          previous: 13.8,
          trend: 'up',
          unit: '%'
        }
      ];

      setPlans(samplePlans);
      setMetrics(sampleMetrics);

    } catch (error) {
      console.error('Error loading performance data:', error);
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

  const getVarianceColor = (variance: number) => {
    if (variance > 0) return 'text-green-600';
    if (variance < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getVarianceIcon = (variance: number) => {
    if (variance > 0) return <ChevronUpIcon className="h-4 w-4" />;
    if (variance < 0) return <ChevronDownIcon className="h-4 w-4" />;
    return <div className="h-4 w-4 bg-gray-400 rounded-full"></div>;
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ChevronUpIcon className="h-4 w-4 text-green-500" />;
      case 'down': return <ChevronDownIcon className="h-4 w-4 text-red-500" />;
      default: return <div className="h-4 w-4 bg-gray-400 rounded-full"></div>;
    }
  };

  const getPerformanceScore = (actual: number, target: number) => {
    const score = (actual / target) * 100;
    if (score >= 100) return { label: 'Excellent', color: 'text-green-600 bg-green-100' };
    if (score >= 90) return { label: 'Good', color: 'text-blue-600 bg-blue-100' };
    if (score >= 80) return { label: 'Fair', color: 'text-yellow-600 bg-yellow-100' };
    return { label: 'Poor', color: 'text-red-600 bg-red-100' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ArrowPathIcon className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading performance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">⭐ Performance Tracking</h1>
          <p className="text-gray-600">Monitor and analyze investment plan performance metrics</p>
        </div>

        {/* Controls */}
        <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-2">
            <select
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Plans</option>
              {plans.map(plan => (
                <option key={plan.id} value={plan.id}>{plan.name}</option>
              ))}
            </select>
            
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="1y">Last Year</option>
            </select>
          </div>

          <button
            onClick={loadPerformanceData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <ArrowPathIcon className="h-4 w-4" />
            Refresh
          </button>
        </div>

        {/* Key Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{metric.name}</h3>
                {getTrendIcon(metric.trend)}
              </div>
              
              <div className="flex items-baseline justify-between mb-2">
                <div className="text-2xl font-bold text-gray-900">
                  {metric.unit === 'TZS' ? formatCurrency(metric.current) : `${metric.current}${metric.unit}`}
                </div>
                <div className="text-sm text-gray-500">
                  Target: {metric.unit === 'TZS' ? formatCurrency(metric.target) : `${metric.target}${metric.unit}`}
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div 
                  className={`h-2 rounded-full ${
                    metric.current >= metric.target ? 'bg-green-500' : 'bg-yellow-500'
                  }`}
                  style={{ width: `${Math.min((metric.current / metric.target) * 100, 100)}%` }}
                ></div>
              </div>
              
              <div className="text-sm text-gray-600">
                Previous: {metric.unit === 'TZS' ? formatCurrency(metric.previous) : `${metric.previous}${metric.unit}`}
                <span className={`ml-2 ${metric.trend === 'up' ? 'text-green-600' : metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
                  ({metric.current > metric.previous ? '+' : ''}{((metric.current - metric.previous) / metric.previous * 100).toFixed(1)}%)
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Performance Trend Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Performance Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString()} />
                <YAxis />
                <Tooltip 
                  labelFormatter={(date) => new Date(date).toLocaleDateString()}
                  formatter={(value: number) => [`${value}%`, '']}
                />
                <Legend />
                <Line type="monotone" dataKey="basic" stroke="#3B82F6" strokeWidth={2} name="Basic Plan" />
                <Line type="monotone" dataKey="premium" stroke="#10B981" strokeWidth={2} name="Premium Plan" />
                <Line type="monotone" dataKey="vip" stroke="#F59E0B" strokeWidth={2} name="VIP Plan" />
                <Line type="monotone" dataKey="target" stroke="#EF4444" strokeWidth={2} strokeDasharray="5 5" name="Target" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Plan Comparison Radar */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Plan Comparison</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" />
                <PolarRadiusAxis angle={90} domain={[0, 110]} />
                <Radar name="Basic" dataKey="basic" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1} />
                <Radar name="Premium" dataKey="premium" stroke="#10B981" fill="#10B981" fillOpacity={0.1} />
                <Radar name="VIP" dataKey="vip" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.1} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Plan Performance Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">📊 Detailed Plan Performance</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Returns</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Investors</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Satisfaction</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Retention</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {plans.map((plan) => {
                  const performanceScore = getPerformanceScore(plan.actualReturn, plan.targetReturn);
                  return (
                    <tr key={plan.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{plan.name}</div>
                          <div className="text-sm text-gray-500">Created {new Date(plan.createdAt).toLocaleDateString()}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-900">{plan.actualReturn}%</span>
                          <span className="text-xs text-gray-500">vs {plan.targetReturn}%</span>
                        </div>
                        <div className={`flex items-center gap-1 text-xs ${getVarianceColor(plan.variance)}`}>
                          {getVarianceIcon(plan.variance)}
                          {plan.variance > 0 ? '+' : ''}{plan.variance.toFixed(1)}%
                        </div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${performanceScore.color}`}>
                          {performanceScore.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{formatCurrency(plan.totalReturns)}</div>
                        <div className="text-sm text-gray-500">from {formatCurrency(plan.totalInvested)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <UsersIcon className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{plan.activeInvestors}</span>
                        </div>
                        <div className="text-sm text-gray-500">Avg: {formatCurrency(plan.avgInvestmentSize)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <StarIcon className="h-4 w-4 text-yellow-400" />
                          <span className="text-sm font-medium text-gray-900">{plan.satisfactionScore}/5</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-green-600">{plan.retentionRate}%</span>
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
                        <button className="text-blue-600 hover:text-blue-900">
                          <EyeIcon className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <ChartBarIcon className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{plans.length}</div>
            <div className="text-sm text-gray-600">Active Plans</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <CurrencyDollarIcon className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(plans.reduce((sum, plan) => sum + plan.totalReturns, 0))}
            </div>
            <div className="text-sm text-gray-600">Total Returns</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <UsersIcon className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {plans.reduce((sum, plan) => sum + plan.activeInvestors, 0)}
            </div>
            <div className="text-sm text-gray-600">Active Investors</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <StarIcon className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {(plans.reduce((sum, plan) => sum + plan.satisfactionScore, 0) / plans.length).toFixed(1)}/5
            </div>
            <div className="text-sm text-gray-600">Avg Satisfaction</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceTrackingPage;
