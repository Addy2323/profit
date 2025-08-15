import React, { useState, useEffect } from 'react';
import {
  ShieldExclamationIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ArrowPathIcon,
  EyeIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface RiskMetric {
  id: string;
  name: string;
  value: number;
  threshold: number;
  status: 'safe' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  description: string;
  lastUpdated: string;
}

interface RiskAlert {
  id: string;
  type: 'liquidity' | 'concentration' | 'default' | 'market' | 'operational';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  affectedAmount: number;
  affectedUsers: number;
  timestamp: string;
  isResolved: boolean;
}

const RiskMonitorPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<RiskMetric[]>([]);
  const [alerts, setAlerts] = useState<RiskAlert[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'24h' | '7d' | '30d' | '90d'>('7d');

  // Sample risk data
  const riskTrendData = [
    { date: '2024-07-30', overall: 25, liquidity: 15, concentration: 35, default: 20, market: 30 },
    { date: '2024-07-31', overall: 28, liquidity: 18, concentration: 38, default: 22, market: 32 },
    { date: '2024-08-01', overall: 32, liquidity: 22, concentration: 42, default: 25, market: 35 },
    { date: '2024-08-02', overall: 29, liquidity: 20, concentration: 38, default: 23, market: 33 },
    { date: '2024-08-03', overall: 26, liquidity: 17, concentration: 35, default: 21, market: 31 },
    { date: '2024-08-04', overall: 24, liquidity: 15, concentration: 33, default: 19, market: 29 },
    { date: '2024-08-05', overall: 22, liquidity: 13, concentration: 31, default: 17, market: 27 }
  ];

  const riskDistribution = [
    { name: 'Low Risk', value: 45, color: '#10B981' },
    { name: 'Medium Risk', value: 35, color: '#F59E0B' },
    { name: 'High Risk', value: 15, color: '#EF4444' },
    { name: 'Critical Risk', value: 5, color: '#7C2D12' }
  ];

  const portfolioRisk = [
    { plan: 'Basic Plan', exposure: 2500000, riskScore: 15, users: 45 },
    { plan: 'Premium Plan', exposure: 8200000, riskScore: 25, users: 67 },
    { plan: 'VIP Plan', exposure: 15600000, riskScore: 35, users: 23 }
  ];

  useEffect(() => {
    loadRiskData();
  }, [selectedTimeframe]);

  const loadRiskData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Sample risk metrics
      const sampleMetrics: RiskMetric[] = [
        {
          id: '1',
          name: 'Overall Risk Score',
          value: 22,
          threshold: 30,
          status: 'safe',
          trend: 'down',
          description: 'Composite risk assessment across all investment plans',
          lastUpdated: '2024-08-05T19:00:00Z'
        },
        {
          id: '2',
          name: 'Liquidity Risk',
          value: 13,
          threshold: 20,
          status: 'safe',
          trend: 'down',
          description: 'Risk of insufficient funds for withdrawals',
          lastUpdated: '2024-08-05T19:00:00Z'
        },
        {
          id: '3',
          name: 'Concentration Risk',
          value: 31,
          threshold: 25,
          status: 'warning',
          trend: 'up',
          description: 'Risk from over-concentration in specific plans or users',
          lastUpdated: '2024-08-05T19:00:00Z'
        },
        {
          id: '4',
          name: 'Default Risk',
          value: 17,
          threshold: 15,
          status: 'warning',
          trend: 'stable',
          description: 'Risk of users defaulting on investments',
          lastUpdated: '2024-08-05T19:00:00Z'
        },
        {
          id: '5',
          name: 'Market Risk',
          value: 27,
          threshold: 30,
          status: 'safe',
          trend: 'down',
          description: 'Risk from market volatility and external factors',
          lastUpdated: '2024-08-05T19:00:00Z'
        },
        {
          id: '6',
          name: 'Operational Risk',
          value: 8,
          threshold: 15,
          status: 'safe',
          trend: 'stable',
          description: 'Risk from operational failures and system issues',
          lastUpdated: '2024-08-05T19:00:00Z'
        }
      ];

      // Sample risk alerts
      const sampleAlerts: RiskAlert[] = [
        {
          id: '1',
          type: 'concentration',
          severity: 'high',
          title: 'High Concentration in VIP Plan',
          description: 'VIP Plan accounts for 60% of total investment exposure, exceeding safe concentration limits.',
          affectedAmount: 15600000,
          affectedUsers: 23,
          timestamp: '2024-08-05T18:30:00Z',
          isResolved: false
        },
        {
          id: '2',
          type: 'liquidity',
          severity: 'medium',
          title: 'Approaching Liquidity Threshold',
          description: 'Available liquidity is approaching minimum threshold for safe operations.',
          affectedAmount: 5000000,
          affectedUsers: 0,
          timestamp: '2024-08-05T17:45:00Z',
          isResolved: false
        },
        {
          id: '3',
          type: 'default',
          severity: 'medium',
          title: 'Increased Default Indicators',
          description: 'Several users showing early warning signs of potential default.',
          affectedAmount: 2300000,
          affectedUsers: 8,
          timestamp: '2024-08-05T16:20:00Z',
          isResolved: false
        }
      ];

      setMetrics(sampleMetrics);
      setAlerts(sampleAlerts);

    } catch (error) {
      console.error('Error loading risk data:', error);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-blue-600 bg-blue-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ChevronUpIcon className="h-4 w-4 text-red-500" />;
      case 'down': return <ChevronDownIcon className="h-4 w-4 text-green-500" />;
      default: return <div className="h-4 w-4 bg-gray-400 rounded-full"></div>;
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score <= 15) return 'text-green-600';
    if (score <= 25) return 'text-yellow-600';
    if (score <= 35) return 'text-orange-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ArrowPathIcon className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading risk monitoring data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">⚠️ Risk Monitor Dashboard</h1>
          <p className="text-gray-600">Real-time risk assessment and monitoring for investment operations</p>
        </div>

        {/* Timeframe Selector */}
        <div className="mb-6">
          <div className="flex space-x-2">
            {(['24h', '7d', '30d', '90d'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedTimeframe(period)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedTimeframe === period
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {period === '24h' ? '24 Hours' : period === '7d' ? '7 Days' : period === '30d' ? '30 Days' : '90 Days'}
              </button>
            ))}
          </div>
        </div>

        {/* Risk Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {metrics.map((metric) => (
            <div key={metric.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{metric.name}</h3>
                {getTrendIcon(metric.trend)}
              </div>
              
              <div className="flex items-center justify-between mb-2">
                <div className="text-3xl font-bold text-gray-900">{metric.value}%</div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(metric.status)}`}>
                  {metric.status.toUpperCase()}
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div 
                  className={`h-2 rounded-full ${
                    metric.status === 'safe' ? 'bg-green-500' : 
                    metric.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min((metric.value / metric.threshold) * 100, 100)}%` }}
                ></div>
              </div>
              
              <p className="text-sm text-gray-600 mb-2">{metric.description}</p>
              <p className="text-xs text-gray-500">
                Threshold: {metric.threshold}% | Updated: {new Date(metric.lastUpdated).toLocaleTimeString()}
              </p>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Risk Trend Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Risk Trends Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={riskTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString()} />
                <YAxis />
                <Tooltip 
                  labelFormatter={(date) => new Date(date).toLocaleDateString()}
                  formatter={(value: number) => [`${value}%`, '']}
                />
                <Legend />
                <Line type="monotone" dataKey="overall" stroke="#3B82F6" strokeWidth={3} name="Overall Risk" />
                <Line type="monotone" dataKey="liquidity" stroke="#10B981" strokeWidth={2} name="Liquidity" />
                <Line type="monotone" dataKey="concentration" stroke="#F59E0B" strokeWidth={2} name="Concentration" />
                <Line type="monotone" dataKey="default" stroke="#EF4444" strokeWidth={2} name="Default" />
                <Line type="monotone" dataKey="market" stroke="#8B5CF6" strokeWidth={2} name="Market" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Risk Distribution */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🥧 Risk Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Portfolio Risk Analysis */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Portfolio Risk Analysis</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={portfolioRisk}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="plan" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                formatter={(value: number, name: string) => {
                  if (name === 'exposure') return [formatCurrency(value), 'Exposure'];
                  if (name === 'riskScore') return [`${value}%`, 'Risk Score'];
                  return [value, name];
                }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="exposure" fill="#3B82F6" name="Exposure (TZS)" />
              <Bar yAxisId="right" dataKey="riskScore" fill="#EF4444" name="Risk Score %" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Alerts */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">🚨 Active Risk Alerts</h3>
            <button
              onClick={loadRiskData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <ArrowPathIcon className="h-4 w-4" />
              Refresh
            </button>
          </div>
          
          <div className="divide-y divide-gray-200">
            {alerts.length === 0 ? (
              <div className="p-12 text-center">
                <ShieldExclamationIcon className="h-16 w-16 text-green-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Risk Alerts</h3>
                <p className="text-gray-500">All risk metrics are within acceptable thresholds.</p>
              </div>
            ) : (
              alerts.map((alert) => (
                <div key={alert.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex-shrink-0">
                        <ExclamationTriangleIcon className={`h-6 w-6 ${
                          alert.severity === 'critical' ? 'text-red-500' :
                          alert.severity === 'high' ? 'text-orange-500' :
                          alert.severity === 'medium' ? 'text-yellow-500' : 'text-blue-500'
                        }`} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-lg font-semibold text-gray-900">{alert.title}</h4>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(alert.severity)}`}>
                            {alert.severity.toUpperCase()}
                          </span>
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                            {alert.type.toUpperCase()}
                          </span>
                        </div>
                        
                        <p className="text-gray-700 mb-3">{alert.description}</p>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <CalendarDaysIcon className="h-4 w-4" />
                            {new Date(alert.timestamp).toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <CurrencyDollarIcon className="h-4 w-4" />
                            {formatCurrency(alert.affectedAmount)}
                          </span>
                          {alert.affectedUsers > 0 && (
                            <span className="flex items-center gap-1">
                              <UserGroupIcon className="h-4 w-4" />
                              {alert.affectedUsers} users
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">
                        <EyeIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Risk Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <ShieldExclamationIcon className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{metrics.length}</div>
            <div className="text-sm text-gray-600">Risk Metrics</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <ExclamationTriangleIcon className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{alerts.length}</div>
            <div className="text-sm text-gray-600">Active Alerts</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <ChartBarIcon className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {metrics.find(m => m.name === 'Overall Risk Score')?.value || 0}%
            </div>
            <div className="text-sm text-gray-600">Overall Risk</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <CurrencyDollarIcon className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(portfolioRisk.reduce((sum, plan) => sum + plan.exposure, 0))}
            </div>
            <div className="text-sm text-gray-600">Total Exposure</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskMonitorPage;
