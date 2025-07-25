import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  CalendarIcon,
  FolderIcon,
  UsersIcon,
  CogIcon,
  UserCircleIcon,
  PlusIcon,
  EyeIcon,
  TrashIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  ChevronRightIcon,
  ChartBarIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

const AdminLTELayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(true);
  const { logout } = useAuth();
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
                <h1 className="font-bold text-xl text-gray-800">AdminPanel</h1>
                <p className="text-xs text-gray-500">Management System</p>
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

          {/* All Appointments */}
          <NavLink
            to="/admin/appointments"
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
            <CalendarIcon className="h-5 w-5" />
            {!sidebarCollapsed && <span className="font-medium">All Appointments</span>}
          </NavLink>

          {/* Categories */}
          {!sidebarCollapsed && (
            <div>
              <div
                className="flex items-center justify-between px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl cursor-pointer transition-all duration-200"
                onClick={() => setCategoriesOpen(!categoriesOpen)}
              >
                <div className="flex items-center space-x-3">
                  <FolderIcon className="h-5 w-5" />
                  <span className="font-medium">Categories</span>
                </div>
                {categoriesOpen ? (
                  <ChevronDownIcon className="h-4 w-4" />
                ) : (
                  <ChevronRightIcon className="h-4 w-4" />
                )}
              </div>
              {categoriesOpen && (
                <div className="ml-8 space-y-1">
                  <NavLink
                    to="/admin/categories/new"
                    className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 no-underline"
                  >
                    <PlusIcon className="h-4 w-4" />
                    <span>Add New</span>
                  </NavLink>
                  <NavLink
                    to="/admin/categories"
                    className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 no-underline"
                  >
                    <EyeIcon className="h-4 w-4" />
                    <span>View All</span>
                  </NavLink>
                </div>
              )}
            </div>
          )}

          {/* Services */}
          {!sidebarCollapsed && (
            <div>
              <NavLink
                to="/admin/services"
                className={({ isActive }) =>
                  `flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 no-underline ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                  }`
                }
                onClick={() => setServicesOpen(!servicesOpen)}
              >
                <div className="flex items-center space-x-3">
                  <CogIcon className="h-5 w-5" />
                  <span className="font-medium">Services</span>
                </div>
                {servicesOpen ? (
                  <ChevronDownIcon className="h-4 w-4" />
                ) : (
                  <ChevronRightIcon className="h-4 w-4" />
                )}
              </NavLink>
              {servicesOpen && (
                <div className="ml-8 space-y-1 mt-2">
                  <NavLink
                    to="/admin/services/new"
                    className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                  >
                    <PlusIcon className="h-4 w-4" />
                    <span>Create Service</span>
                  </NavLink>
                  <NavLink
                    to="/admin/services"
                    className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                  >
                    <EyeIcon className="h-4 w-4" />
                    <span>View All</span>
                  </NavLink>
                  <NavLink
                    to="/admin/services/trash"
                    className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                  >
                    <TrashIcon className="h-4 w-4" />
                    <span>View Trash</span>
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