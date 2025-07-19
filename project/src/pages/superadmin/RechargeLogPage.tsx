import React, { useState, useEffect } from 'react';
import { User, Transaction } from '../../types';

interface RechargeTransaction extends Transaction {
  userName?: string;
}

const SuperAdminRechargeLogPage: React.FC = () => {
  const [recharges, setRecharges] = useState<RechargeTransaction[]>([]);

  useEffect(() => {
    const allUsers: User[] = JSON.parse(localStorage.getItem('profitnet_users') || '[]');
    let allRecharges: RechargeTransaction[] = [];

    allUsers.forEach(user => {
      const userTransactions: Transaction[] = JSON.parse(localStorage.getItem(`transactions_${user.id}`) || '[]');
      const userRecharges = userTransactions
        .filter(t => t.type === 'recharge')
        .map(t => ({ ...t, userName: user.name }));
      allRecharges = [...allRecharges, ...userRecharges];
    });

    setRecharges(allRecharges.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  }, []);

  return (
    <div className="container mx-auto p-4 text-white">
      <h1 className="text-3xl font-bold mb-6 text-red-500">Global Recharge Log</h1>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">User</th>
              <th className="px-4 py-2 text-left">Amount</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Description</th>
            </tr>
          </thead>
          <tbody>
            {recharges.map(r => (
              <tr key={r.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                <td className="px-4 py-2">{r.userName}</td>
                <td className="px-4 py-2 text-green-400">+${r.amount.toFixed(2)}</td>
                <td className="px-4 py-2">{new Date(r.createdAt).toLocaleString()}</td>
                <td className="px-4 py-2">{r.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SuperAdminRechargeLogPage;
