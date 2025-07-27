import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  CreditCard, 
  Banknote, 
  Share, 
  Headphones, 
  Link as LinkIcon, 
  FileText, 
  TrendingDown, 
  DollarSign, 
  Dice6, 
  LogOut
} from 'lucide-react';
import InvitationCard from '../components/InvitationCard';

const DashboardPage: React.FC = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { icon: CreditCard, label: 'Recharge', path: '/recharge', color: 'from-cyan-500 to-cyan-600' },
    { icon: Banknote, label: 'Withdraw', path: '/withdrawal', color: 'from-green-500 to-green-600' },
    { icon: Share, label: 'Invite', path: '/share', color: 'from-purple-500 to-purple-600' },
    { icon: Headphones, label: 'Customer Service', path: '/CustomerService', color: 'from-blue-500 to-blue-600' },
    { icon: LinkIcon, label: 'App Download', path: '/download', color: 'from-orange-500 to-orange-600' },
    { icon: FileText, label: 'About Us', path: '/about', color: 'from-yellow-500 to-yellow-600' },
    { icon: TrendingDown, label: 'Transaction History', path: '/transaction-history', color: 'from-red-500 to-red-600' },
    { icon: DollarSign, label: 'Recharge Log', path: '/recharge-log', color: 'from-indigo-500 to-indigo-600' },
    { icon: Dice6, label: 'Lottery', path: '/lucky-draw', color: 'from-pink-500 to-pink-600' },
    { icon: LogOut, label: 'Logout', action: 'logout', color: 'from-gray-500 to-gray-600' }
  ];

  const handleMenuClick = (item: any) => {
    if (item.action === 'logout') {
      handleLogout();
    } else if (item.path) {
      navigate(item.path);
    } else if (item.action && item.action.startsWith('/')) {
      navigate(item.action);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* User Info Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Welcome, {user?.name}</h1>
            <p className="text-blue-100 text-sm">Your financial dashboard</p>
          </div>
          <div className="text-right">
            <p className="text-blue-100 text-sm">Current Balance</p>
            <p className="text-2xl font-bold text-white">TSh {user?.balance?.toLocaleString() || '0'}</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Earnings</p>
                <p className="text-white font-bold">TSh {user?.balance?.toLocaleString() || '0'}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Referral Code</p>
                <p className="text-white font-bold">{user?.referralCode || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-4 py-6 space-y-3">
        {menuItems.map((item, index) => (
          item.path ? (
            <Link
              key={index}
              to={item.path}
              className="flex items-center justify-between bg-gray-800 rounded-xl p-4 hover:bg-gray-700 transition-colors no-underline"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 bg-gradient-to-r ${item.color} rounded-lg flex items-center justify-center`}>
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-white font-medium">{item.label}</span>
              </div>
              <div className="text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ) : (
            <button
              key={index}
              onClick={() => handleMenuClick(item)}
              className="w-full flex items-center justify-between bg-gray-800 rounded-xl p-4 hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 bg-gradient-to-r ${item.color} rounded-lg flex items-center justify-center`}>
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-white font-medium">{item.label}</span>
              </div>
              <div className="text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          )
        ))}
      </div>

   
    </div>
  );
};

export default DashboardPage;