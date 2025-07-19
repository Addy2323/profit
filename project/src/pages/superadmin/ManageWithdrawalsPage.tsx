import React, { useState, useEffect } from 'react';
import { User } from '../../types';

interface Withdrawal {
  id: string;
  userId: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
  userName?: string; // Add userName for display purposes
}

const ManageWithdrawalsPage: React.FC = () => {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);

  useEffect(() => {
    const allUsers: User[] = JSON.parse(localStorage.getItem('profitnet_users') || '[]');
    let allWithdrawals: Withdrawal[] = [];

    allUsers.forEach(user => {
      const userWithdrawals: Withdrawal[] = JSON.parse(localStorage.getItem(`withdrawals_${user.id}`) || '[]');
      const withdrawalsWithUserInfo = userWithdrawals.map(w => ({ ...w, userName: user.name }));
      allWithdrawals = [...allWithdrawals, ...withdrawalsWithUserInfo];
    });

    setWithdrawals(allWithdrawals.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  }, []);

  const handleUpdateStatus = (withdrawalId: string, userId: string, newStatus: 'approved' | 'rejected') => {
    const userWithdrawals: Withdrawal[] = JSON.parse(localStorage.getItem(`withdrawals_${userId}`) || '[]');
    const updatedWithdrawals = userWithdrawals.map(w => {
      if (w.id === withdrawalId) {
        return { ...w, status: newStatus };
      }
      return w;
    });

    localStorage.setItem(`withdrawals_${userId}`, JSON.stringify(updatedWithdrawals));

    // Refresh the list
    const allUsers: User[] = JSON.parse(localStorage.getItem('profitnet_users') || '[]');
    let allWithdrawals: Withdrawal[] = [];
    allUsers.forEach(user => {
      const userWithdrawals: Withdrawal[] = JSON.parse(localStorage.getItem(`withdrawals_${user.id}`) || '[]');
      const withdrawalsWithUserInfo = userWithdrawals.map(w => ({ ...w, userName: user.name }));
      allWithdrawals = [...allWithdrawals, ...withdrawalsWithUserInfo];
    });
    setWithdrawals(allWithdrawals.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  return (
    <div className="container mx-auto p-4 text-white">
      <h1 className="text-3xl font-bold mb-6 text-red-500">Manage Withdrawals</h1>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">User</th>
              <th className="px-4 py-2 text-left">Amount</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {withdrawals.map(w => (
              <tr key={w.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                <td className="px-4 py-2">{w.userName}</td>
                <td className="px-4 py-2">${w.amount.toFixed(2)}</td>
                <td className="px-4 py-2">{new Date(w.date).toLocaleString()}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold 
                    ${w.status === 'approved' ? 'bg-green-500' : w.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'}`}>
                    {w.status}
                  </span>
                </td>
                <td className="px-4 py-2">
                  {w.status === 'pending' && (
                    <div className="flex space-x-2">
                      <button onClick={() => handleUpdateStatus(w.id, w.userId, 'approved')} className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded">Approve</button>
                      <button onClick={() => handleUpdateStatus(w.id, w.userId, 'rejected')} className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded">Reject</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageWithdrawalsPage;
