import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  UsersIcon,
  ShoppingBagIcon,
  BanknotesIcon,
  CubeIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: HomeIcon },
  { path: '/admin/users', label: 'Users', icon: UsersIcon },
  { path: '/admin/transactions', label: 'Transactions', icon: BanknotesIcon },
  { path: '/admin/purchases', label: 'Purchases', icon: ShoppingBagIcon },
  { path: '/admin/products', label: 'Products', icon: CubeIcon },
  { path: '/admin/withdraw', label: 'Withdraw', icon: BanknotesIcon },
];

const AdminLayout: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-900">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-white border-r border-gray-200 shadow-lg transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 md:py-5 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="text-lg font-semibold text-gray-800">ADMINDEK</span>
          </div>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <nav className="px-2 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-100 ${
                  isActive ? 'bg-gray-200 font-semibold' : ''
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-red-50 text-red-600"
          >
            <ArrowLeftOnRectangleIcon className="w-5 h-5" /> Logout
          </button>
        </nav>
      </aside>

      {/* Content area */}
      <div className="flex flex-col flex-1 md:ml-64">
        {/* Topbar */}
        <header className="sticky top-0 z-20 flex items-center justify-between bg-white px-4 py-3 shadow-sm border-b border-gray-200 md:py-4 md:px-6">
          <div className="flex items-center space-x-4">
            <button className="md:hidden" onClick={() => setSidebarOpen(true)}>
              <Bars3Icon className="w-6 h-6" />
            </button>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">👋</span>
              <span className="text-sm text-gray-600">Welcome back, Admin</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
              </button>
            </div>
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">JD</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
