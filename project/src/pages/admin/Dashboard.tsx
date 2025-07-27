import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import {
  EyeIcon,
  TrophyIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  PlusIcon,
  CogIcon,
  DocumentTextIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface MetricCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  color: 'blue' | 'green' | 'purple' | 'orange';
  trend?: {
    value: string;
    isUp: boolean;
  };
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, subtitle, icon: Icon, color, trend }) => {
  const colorClasses = {
    blue: 'bg-blue-500 text-white',
    green: 'bg-green-500 text-white',
    purple: 'bg-purple-500 text-white',
    orange: 'bg-orange-500 text-white',
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
          <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
          <p className="text-sm text-gray-500">{subtitle}</p>
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${
              trend.isUp ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend.isUp ? (
                <ArrowUpIcon className="w-4 h-4 mr-1" />
              ) : (
                <ArrowDownIcon className="w-4 h-4 mr-1" />
              )}
              {trend.value}
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Quick action items for admin
  const quickActions = [
    {
      title: 'Create Investment Plan',
      description: 'Add new investment opportunity',
      icon: PlusIcon,
      color: 'bg-blue-500',
      action: () => navigate('/admin/investments/create')
    },
    {
      title: 'Manage Users',
      description: 'View and manage user accounts',
      icon: UsersIcon,
      color: 'bg-green-500',
      action: () => navigate('/admin/users')
    },
    {
      title: 'Daily Returns',
      description: 'Monitor daily income distribution',
      icon: ChartBarIcon,
      color: 'bg-purple-500',
      action: () => navigate('/admin/daily-returns')
    },
    {
      title: 'Withdrawals',
      description: 'Process withdrawal requests',
      icon: CogIcon,
      color: 'bg-orange-500',
      action: () => navigate('/admin/withdrawals')
    }
  ];
  // Chart data for Investment Analytics
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Investment Growth (TSh Millions)',
        data: [1.2, 1.8, 2.1, 2.5, 2.3, 2.9, 3.2, 3.8, 4.1, 4.5, 4.8, 5.2],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(59, 130, 246, 0.5)',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 12,
          },
        },
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        border: {
          display: false,
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 12,
          },
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <div className="w-8 h-8 bg-blue-500 rounded mr-3 flex items-center justify-center">
                <span className="text-white font-bold text-sm">{user?.name?.charAt(0) || 'A'}</span>
              </div>
              {user?.role === 'superadmin' ? 'Super Admin Dashboard' : 'Admin Dashboard'}
            </h1>
            <p className="text-gray-600 mt-1">Welcome back, {user?.name}! Here's what's happening with your business today.</p>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-500">Balance: <span className="font-semibold text-green-600">TSh {user?.balance?.toLocaleString() || '0'}</span></span>
            <button 
              onClick={() => navigate('/admin/investments/create')}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              New Investment Plan
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all hover:border-blue-300 text-left group"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 group-hover:text-blue-600">{action.title}</h3>
                  <p className="text-sm text-gray-500">{action.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Investments"
          value="TSh 2,450,000"
          subtitle="Active investments"
          icon={CurrencyDollarIcon}
          color="blue"
          trend={{ value: "+18.5%", isUp: true }}
        />
        <MetricCard
          title="Daily Returns Paid"
          value="TSh 125,400"
          subtitle="Today's distribution"
          icon={TrophyIcon}
          color="green"
          trend={{ value: "+12.3%", isUp: true }}
        />
        <MetricCard
          title="Active Investors"
          value="847"
          subtitle="Total users investing"
          icon={UsersIcon}
          color="purple"
          trend={{ value: "+5.2%", isUp: true }}
        />
        <MetricCard
          title="Pending Withdrawals"
          value="TSh 89,500"
          subtitle="Awaiting approval"
          icon={EyeIcon}
          color="orange"
          trend={{ value: "-3.1%", isUp: false }}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Investment Growth Analytics */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Investment Growth Analytics</h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Last 12 months</span>
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            </div>
          </div>
          <div className="h-80">
            <Line data={chartData} options={chartOptions} />
          </div>
          <div className="mt-4 flex items-center justify-center">
            <button className="text-blue-500 hover:text-blue-600 text-sm font-medium">
              Show all
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Stats</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">New Investments</p>
                <p className="text-xs text-gray-500">Last 24 hours</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">42</p>
                <p className="text-xs text-green-600">+18%</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Pending Withdrawals</p>
                <p className="text-xs text-gray-500">Awaiting approval</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">15</p>
                <p className="text-xs text-orange-600">Action needed</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Returns Processed</p>
                <p className="text-xs text-gray-500">Today</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">847</p>
                <p className="text-xs text-green-600">Completed</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <UsersIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">New investor joined</p>
              <p className="text-xs text-gray-500">sarah.wilson@example.com started investing</p>
            </div>
            <span className="text-xs text-gray-400">2 min ago</span>
          </div>
          <div className="flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <CurrencyDollarIcon className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Investment received</p>
              <p className="text-xs text-gray-500">TSh 150,000 in Premium Plan</p>
            </div>
            <span className="text-xs text-gray-400">5 min ago</span>
          </div>
          <div className="flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <TrophyIcon className="w-5 h-5 text-orange-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Daily returns processed</p>
              <p className="text-xs text-gray-500">847 investors received their daily income</p>
            </div>
            <span className="text-xs text-gray-400">1 hour ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;