import React from 'react';
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
  // Chart data for Deals Analytics
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Deals',
        data: [65, 75, 70, 80, 75, 85, 80, 90, 85, 95, 90, 100],
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
                <span className="text-white font-bold text-sm">A</span>
              </div>
              Dashboard
            </h1>
            <p className="text-gray-600 mt-1">Welcome to your admin dashboard</p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>🏠</span>
            <span>/</span>
            <span>Dashboard</span>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Impressions"
          value="1,563"
          subtitle="May 23 - June 01 (2017)"
          icon={EyeIcon}
          color="blue"
          trend={{ value: "+12.5%", isUp: true }}
        />
        <MetricCard
          title="Goal"
          value="30,564"
          subtitle="May 23 - June 01 (2017)"
          icon={TrophyIcon}
          color="green"
          trend={{ value: "+8.2%", isUp: true }}
        />
        <MetricCard
          title="Total Users"
          value="8,426"
          subtitle="Active users this month"
          icon={UsersIcon}
          color="purple"
          trend={{ value: "-2.1%", isUp: false }}
        />
        <MetricCard
          title="Revenue"
          value="$45,280"
          subtitle="Total earnings this month"
          icon={CurrencyDollarIcon}
          color="orange"
          trend={{ value: "+15.3%", isUp: true }}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Deals Analytics Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Deals Analytics</h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">JS chart by amCharts</span>
              <button className="text-gray-400 hover:text-gray-600">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </div>
          </div>
          <div className="h-64">
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
                <p className="text-sm font-medium text-gray-900">New Orders</p>
                <p className="text-xs text-gray-500">Last 24 hours</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">156</p>
                <p className="text-xs text-green-600">+23%</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Pending Reviews</p>
                <p className="text-xs text-gray-500">Awaiting approval</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">23</p>
                <p className="text-xs text-orange-600">Action needed</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Support Tickets</p>
                <p className="text-xs text-gray-500">Open tickets</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">8</p>
                <p className="text-xs text-red-600">High priority</p>
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
              <p className="text-sm font-medium text-gray-900">New user registered</p>
              <p className="text-xs text-gray-500">john.doe@example.com joined the platform</p>
            </div>
            <span className="text-xs text-gray-400">2 min ago</span>
          </div>
          <div className="flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <CurrencyDollarIcon className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Payment received</p>
              <p className="text-xs text-gray-500">$250.00 from subscription renewal</p>
            </div>
            <span className="text-xs text-gray-400">5 min ago</span>
          </div>
          <div className="flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <TrophyIcon className="w-5 h-5 text-orange-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Goal achieved</p>
              <p className="text-xs text-gray-500">Monthly sales target reached</p>
            </div>
            <span className="text-xs text-gray-400">1 hour ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;