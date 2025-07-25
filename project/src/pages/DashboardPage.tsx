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
  const { logout } = useAuth();
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