import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';

const WithdrawPage: React.FC = () => {
  const [pendingWithdrawals, setPendingWithdrawals] = useState<any[]>([]);

  const loadPendingWithdrawals = () => {
    const allUsers = JSON.parse(localStorage.getItem('profitnet_users') || '[]');
    const pending: any[] = [];

    allUsers.forEach((user: any) => {
      const userTransactions = JSON.parse(localStorage.getItem(`transactions_${user.id}`) || '[]');
      const userPending = userTransactions
        .filter((tx: any) => tx.type === 'withdrawal' && tx.status === 'pending')
        .map((tx: any) => ({ ...tx, user })); // Add user info to transaction
      pending.push(...userPending);
    });

    pending.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    setPendingWithdrawals(pending);
  };

  useEffect(() => {
    loadPendingWithdrawals();
  }, []);

  const createNotification = (userId: string, title: string, message: string) => {
    const notificationsKey = `notifications_${userId}`;
    const existingNotifications = JSON.parse(localStorage.getItem(notificationsKey) || '[]');
    const newNotification = {
      id: Date.now().toString(),
      title,
      message,
      createdAt: new Date(),
      read: false,
    };
    existingNotifications.unshift(newNotification);
    localStorage.setItem(notificationsKey, JSON.stringify(existingNotifications));
  };

  const handleApproval = (txId: string, userId: string, amount: number, approve: boolean) => {
    const users = JSON.parse(localStorage.getItem('profitnet_users') || '[]');
    const userIndex = users.findIndex((u: any) => u.id === userId);
    const user = users[userIndex];

    const txKey = `transactions_${userId}`;
    const transactions = JSON.parse(localStorage.getItem(txKey) || '[]');
    const txIndex = transactions.findIndex((t: any) => t.id === txId);

    if (txIndex === -1) {
      alert('Transaction not found!');
      return;
    }

    if (approve) {
      transactions[txIndex].status = 'completed';
      createNotification(userId, 'Withdrawal Approved', `Your withdrawal of ${amount.toLocaleString()} TZS has been approved.`);
    } else {
      transactions[txIndex].status = 'failed';
      // Refund the amount to the user's balance
      if (user) {
        users[userIndex].balance = (user.balance || 0) + amount;
        localStorage.setItem('profitnet_users', JSON.stringify(users));
      }
      createNotification(userId, 'Withdrawal Rejected', `Your withdrawal of ${amount.toLocaleString()} TZS was rejected. The amount has been returned to your balance.`);
    }

    localStorage.setItem(txKey, JSON.stringify(transactions));
    alert(`Request has been ${approve ? 'approved' : 'rejected'}.`);
    loadPendingWithdrawals(); // Refresh the list
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Pending Withdrawals</h1>
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">User</th>
              <th className="px-4 py-2 text-right">Amount (TZS)</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingWithdrawals.map(tx => (
              <tr key={tx.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{format(new Date(tx.createdAt), 'yyyy-MM-dd HH:mm')}</td>
                <td className="px-4 py-2">{tx.user.name} ({tx.user.phone})</td>
                <td className="px-4 py-2 text-right">{tx.amount.toLocaleString()}</td>
                <td className="px-4 py-2 text-center space-x-2">
                  <button
                    onClick={() => handleApproval(tx.id, tx.userId, tx.amount, true)}
                    className="px-2 py-1 text-xs bg-green-600 text-white rounded inline-flex items-center gap-1"
                  >
                    <CheckCircle size={14} /> Approve
                  </button>
                  <button
                    onClick={() => handleApproval(tx.id, tx.userId, tx.amount, false)}
                    className="px-2 py-1 text-xs bg-red-600 text-white rounded inline-flex items-center gap-1"
                  >
                    <XCircle size={14} /> Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {pendingWithdrawals.length === 0 && (
          <div className="text-center py-12 text-gray-400">No pending withdrawals.</div>
        )}
      </div>
    </div>
  );
};

export default WithdrawPage;
