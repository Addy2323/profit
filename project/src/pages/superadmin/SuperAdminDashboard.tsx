import React, { useEffect, useState } from 'react';

const SuperAdminDashboard: React.FC = () => {
  const [userCount, setUserCount] = useState(0);
  const [adminCount, setAdminCount] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);

  useEffect(() => {
    // Fetch all users from localStorage
    const users = JSON.parse(localStorage.getItem('profitnet_users') || '[]');
    
    // Filter out regular users and admins
    const regularUsers = users.filter((u: any) => u.role === 'user');
    const admins = users.filter((u: any) => u.role === 'admin');
    
    // Calculate total balance of all users
    const total = users.reduce((acc: number, u: any) => acc + (u.balance || 0), 0);

    setUserCount(regularUsers.length);
    setAdminCount(admins.length);
    setTotalBalance(total);
  }, []);

  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold mb-6 text-red-500">Super Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Users Card */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-red-500 transition-all duration-300">
          <h2 className="text-xl font-semibold text-gray-400 mb-2">Total Users</h2>
          <p className="text-4xl font-bold text-white">{userCount}</p>
        </div>

        {/* Total Admins Card */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-red-500 transition-all duration-300">
          <h2 className="text-xl font-semibold text-gray-400 mb-2">Total Admins</h2>
          <p className="text-4xl font-bold text-white">{adminCount}</p>
        </div>

        {/* Total System Balance Card */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-red-500 transition-all duration-300">
          <h2 className="text-xl font-semibold text-gray-400 mb-2">Total System Balance</h2>
          <p className="text-4xl font-bold text-white">{totalBalance.toLocaleString()} TZS</p>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4 text-red-400">Quick Actions</h2>
        <div className="flex space-x-4">
          <a href="/super-admin/users" className="bg-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-all duration-300">
            Manage Users
          </a>
          <a href="/super-admin/admins" className="bg-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-all duration-300">
            Manage Admins
          </a>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
