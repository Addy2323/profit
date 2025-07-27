import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  UsersIcon,
  CogIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  ChevronRightIcon,
  ChartBarIcon,
  ChevronDownIcon,
  CurrencyDollarIcon,
  BanknotesIcon,
  DocumentTextIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  CreditCardIcon,
  PresentationChartLineIcon
} from '@heroicons/react/24/outline';

const AdminLTELayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [investmentOpen, setInvestmentOpen] = useState(true);
  const [transactionOpen, setTransactionOpen] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin-login');
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <div className={`bg-white shadow-xl border-r border-gray-200 transition-all duration-300 ${
        sidebarCollapsed ? 'w-16' : 'w-72'
      }`}>
        {/* Brand */}
        <div className="p-6 border-b border-gray-100">
          <div className={`flex items-center space-x-3 ${
            sidebarCollapsed ? 'justify-center' : ''
          }`}>
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            {!sidebarCollapsed && (
              <div>
                <h1 className="font-bold text-xl text-gray-800">Investment Hub</h1>
                <p className="text-xs text-gray-500">Daily Income Management</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {/* Dashboard */}
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 no-underline ${
                isActive
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
              } ${
                sidebarCollapsed ? 'justify-center' : ''
              }`
            }
          >
            <ChartBarIcon className="h-5 w-5" />
            {!sidebarCollapsed && <span className="font-medium">Dashboard</span>}
          </NavLink>

          {/* Investment Management */}
          {!sidebarCollapsed && (
            <div>
              <div
                className="flex items-center justify-between px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl cursor-pointer transition-all duration-200"
                onClick={() => setInvestmentOpen(!investmentOpen)}
              >
                <div className="flex items-center space-x-3">
                  <ArrowTrendingUpIcon className="h-5 w-5" />
                  <span className="font-medium">Investment Plans</span>
                </div>
                {investmentOpen ? (
                  <ChevronDownIcon className="h-4 w-4" />
                ) : (
                  <ChevronRightIcon className="h-4 w-4" />
                )}
              </div>
              {investmentOpen && (
                <div className="ml-8 space-y-1">
                  <NavLink
                    to="/admin/investments/create"
                    className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 no-underline"
                  >
                    <CurrencyDollarIcon className="h-4 w-4" />
                    <span>Create Plan</span>
                  </NavLink>
                  <NavLink
                    to="/admin/investments"
                    className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 no-underline"
                  >
                    <PresentationChartLineIcon className="h-4 w-4" />
                    <span>Manage Plans</span>
                  </NavLink>
                  <NavLink
                    to="/admin/daily-returns"
                    className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 no-underline"
                  >
                    <ClockIcon className="h-4 w-4" />
                    <span>Daily Returns</span>
                  </NavLink>
                </div>
              )}
            </div>
          )}

          {/* Transaction Management */}
          {!sidebarCollapsed && (
            <div>
              <div
                className="flex items-center justify-between px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl cursor-pointer transition-all duration-200"
                onClick={() => setTransactionOpen(!transactionOpen)}
              >
                <div className="flex items-center space-x-3">
                  <BanknotesIcon className="h-5 w-5" />
                  <span className="font-medium">Transactions</span>
                </div>
                {transactionOpen ? (
                  <ChevronDownIcon className="h-4 w-4" />
                ) : (
                  <ChevronRightIcon className="h-4 w-4" />
                )}
              </div>
              {transactionOpen && (
                <div className="ml-8 space-y-1">
                  <NavLink
                    to="/admin/transactions"
                    className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 no-underline"
                  >
                    <DocumentTextIcon className="h-4 w-4" />
                    <span>All Transactions</span>
                  </NavLink>
                  <NavLink
                    to="/admin/withdrawals"
                    className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 no-underline"
                  >
                    <CreditCardIcon className="h-4 w-4" />
                    <span>Withdrawals</span>
                  </NavLink>
                  <NavLink
                    to="/admin/recharge-log"
                    className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 no-underline"
                  >
                    <CurrencyDollarIcon className="h-4 w-4" />
                    <span>Recharge Log</span>
                  </NavLink>
                  <NavLink
                    to="/admin/payment-system"
                    className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 no-underline"
                  >
                    <CreditCardIcon className="h-4 w-4" />
                    <span>🚀 Payment System</span>
                  </NavLink>
                </div>
              )}
            </div>
          )}

          {/* Users */}
          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 no-underline ${
                isActive
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
              } ${
                sidebarCollapsed ? 'justify-center' : ''
              }`
            }
          >
            <UsersIcon className="h-5 w-5" />
            {!sidebarCollapsed && <span className="font-medium">Users</span>}
          </NavLink>

          {/* Profile */}
          <NavLink
            to="/admin/profile"
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 no-underline ${
                isActive
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
              } ${
                sidebarCollapsed ? 'justify-center' : ''
              }`
            }
          >
            <UserCircleIcon className="h-5 w-5" />
            {!sidebarCollapsed && <span className="font-medium">Profile</span>}
          </NavLink>

          {/* Settings */}
          <NavLink
            to="/admin/settings"
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 no-underline ${
                isActive
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
              } ${
                sidebarCollapsed ? 'justify-center' : ''
              }`
            }
          >
            <CogIcon className="h-5 w-5" />
            {!sidebarCollapsed && <span className="font-medium">Settings</span>}
          </NavLink>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLTELayout;