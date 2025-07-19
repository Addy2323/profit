import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaTachometerAlt, FaUsers, FaUserShield, FaSignOutAlt, FaMoneyBillWave, FaHistory, FaFileInvoiceDollar } from 'react-icons/fa';

const SuperAdminLayout: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${isActive ? 'bg-red-600 text-white shadow-lg' : 'hover:bg-gray-800 hover:text-red-400'}`;

  const handleLogout = () => {
    logout();
    navigate('/super-admin-login');
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <aside className="w-64 bg-gray-900 flex flex-col border-r border-red-500/30">
        <div className="p-4 border-b border-red-500/30">
          <h2 className="text-2xl font-bold text-red-500">Super Admin</h2>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <NavLink to="/super-admin" end className={getNavLinkClass}>
            <FaTachometerAlt className="mr-3" /> Dashboard
          </NavLink>
          <NavLink to="/super-admin/users" className={getNavLinkClass}>
            <FaUsers className="mr-3" /> Manage Users
          </NavLink>
          <NavLink to="/super-admin/admins" className={getNavLinkClass}>
            <FaUserShield className="mr-3" /> Manage Admins
          </NavLink>
          <NavLink to="/super-admin/withdrawals" className={getNavLinkClass}>
            <FaMoneyBillWave className="mr-3" /> Manage Withdrawals
          </NavLink>
          <NavLink to="/super-admin/transactions" className={getNavLinkClass}>
            <FaHistory className="mr-3" /> Transaction History
          </NavLink>
          <NavLink to="/super-admin/recharge-log" className={getNavLinkClass}>
            <FaFileInvoiceDollar className="mr-3" /> Recharge Log
          </NavLink>
        </nav>
        <div className="p-4 border-t border-red-500/30">
          <button onClick={handleLogout} className="w-full text-left flex items-center px-4 py-2.5 rounded-md text-sm font-medium hover:bg-red-700 transition-all duration-200">
            <FaSignOutAlt className="mr-3" />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 bg-gray-800/50">
        <Outlet />
      </main>
    </div>
  );
};

export default SuperAdminLayout;
