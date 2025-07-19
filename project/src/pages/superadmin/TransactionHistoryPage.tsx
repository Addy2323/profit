import React, { useState, useEffect } from 'react';
import { User, Transaction } from '../../types';

interface TransactionWithUser extends Transaction {
  userName?: string;
}

const TransactionHistoryPage: React.FC = () => {
  const [transactions, setTransactions] = useState<TransactionWithUser[]>([]);

  useEffect(() => {
    const allUsers: User[] = JSON.parse(localStorage.getItem('profitnet_users') || '[]');
    let allTransactions: TransactionWithUser[] = [];

    allUsers.forEach(user => {
      const userTransactions: Transaction[] = JSON.parse(localStorage.getItem(`transactions_${user.id}`) || '[]');
      const transactionsWithUserInfo = userTransactions.map(t => ({ ...t, userName: user.name }));
      allTransactions = [...allTransactions, ...transactionsWithUserInfo];
    });

    setTransactions(allTransactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  }, []);

  return (
    <div className="container mx-auto p-4 text-white">
      <h1 className="text-3xl font-bold mb-6 text-red-500">Global Transaction History</h1>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">User</th>
              <th className="px-4 py-2 text-left">Type</th>
              <th className="px-4 py-2 text-left">Amount</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Description</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(t => (
              <tr key={t.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                <td className="px-4 py-2">{t.userName}</td>
                <td className="px-4 py-2">
                  <span className={`capitalize px-2 py-1 rounded-full text-xs font-semibold 
                    ${t.type === 'recharge' ? 'bg-blue-500' : 
                      t.type === 'withdraw' ? 'bg-orange-500' : 
                      t.type === 'purchase' ? 'bg-purple-500' : 'bg-green-500'}`}>
                    {t.type}
                  </span>
                </td>
                <td className={`px-4 py-2 ${t.amount < 0 ? 'text-red-400' : 'text-green-400'}`}>
                  {t.amount < 0 ? '-' : '+'}${Math.abs(t.amount).toFixed(2)}
                </td>
                <td className="px-4 py-2">{new Date(t.createdAt).toLocaleString()}</td>
                <td className="px-4 py-2">{t.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionHistoryPage;
