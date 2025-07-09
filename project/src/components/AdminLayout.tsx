import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const navItems = [
  { path: '/admin', label: 'Dashboard' },
  { path: '/admin/users', label: 'Users' },
  { path: '/admin/transactions', label: 'Transactions' },
  { path: '/admin/purchases', label: 'Purchases' },
  { path: '/admin/products', label: 'Products' },
  { path: '/admin/withdraw', label: 'Withdraw' },
];

const AdminLayout: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-56 bg-gray-900 text-white flex flex-col">
        <h2 className="text-xl font-bold p-4 border-b border-gray-700">Admin</h2>
        <nav className="flex-1 px-2 py-4 space-y-2">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-sm ${isActive ? 'bg-gray-700' : 'hover:bg-gray-800'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="m-4 py-2 text-sm rounded bg-red-600 hover:bg-red-700"
        >
          Logout
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
