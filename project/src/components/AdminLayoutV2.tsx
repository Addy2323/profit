import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
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

const AdminLayoutV2: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 ${collapsed ? 'w-20' : 'w-64'} transform bg-[#0f1e34] text-gray-100 transition-all duration-200 md:static md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4 md:py-5">
          <span className="text-lg font-semibold">Admin Panel</span>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <nav className="space-y-1 px-2 py-4">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-blue-900/70 ${
                location.pathname === item.path ? 'bg-blue-900/70 text-white' : ''
              }`}
              end
            >
              <item.icon className="h-5 w-5" />
              {!collapsed && item.label}
            </NavLink>
          ))}
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5" /> Logout
          </button>
        </nav>
      </aside>

      {/* Content */}
      <div className={`flex flex-1 flex-col ${collapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        
          <div className="flex items-center gap-3">
            <button className="md:hidden" onClick={() => setSidebarOpen(true)}>
              <Bars3Icon className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-semibold">Dashboard</h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative">
              <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-9.33-5M13 21h-2m6 0a2 2 0 01-2 2H9a2 2 0 01-2-2" /></svg>
              <span className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">5</span>
            </div>
            <div className="relative">
              <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8a9 9 0 110-18 9 9 0 010 18z" /></svg>
              <span className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-green-500 text-xs text-white flex items-center justify-center">3</span>
            </div>
            <img src="https://i.pravatar.cc/32" alt="avatar" className="h-8 w-8 rounded-full" />
          </div>
        

        <main className="flex-1 pt-16 p-4 md:p-6">
          <Outlet />
        </main>
      {/* Global topbar */}
      <header className="fixed top-0 left-0 right-0 z-30 flex h-16 items-center justify-between bg-white px-4 shadow md:px-6">
        <div className="flex items-center gap-3">
          <button className="text-gray-600 md:hidden" onClick={() => setSidebarOpen(true)}>
            <Bars3Icon className="h-6 w-6" />
          </button>
          <button className="hidden md:inline-flex text-gray-600" onClick={() => setCollapsed(!collapsed)}>
            <Bars3Icon className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-semibold">Dashboard</h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative">
            <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-9.33-5M13 21h-2m6 0a2 2 0 01-2 2H9a2 2 0 01-2-2" /></svg>
            <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">5</span>
          </div>
          <div className="relative">
            <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8a9 9 0 110-18 9 9 0 010 18z" /></svg>
            <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-green-500 text-xs text-white">3</span>
          </div>
          <img src="https://i.pravatar.cc/32" alt="avatar" className="h-8 w-8 rounded-full" />
        </div>
      </header>
    </div>
  </div>
  );
};

export default AdminLayoutV2;
