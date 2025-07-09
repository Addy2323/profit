import React, { useState } from 'react';
import { ArrowDownCircle } from 'lucide-react';

/**
 * WithdrawPage – Admin tool to deduct money from any user's balance and
 * record a completed withdrawal transaction. All data is persisted in
 * localStorage following the same conventions used elsewhere in the app.
 */
const WithdrawPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>(() => JSON.parse(localStorage.getItem('profitnet_users') || '[]'));
  const [search, setSearch] = useState('');

  const saveUsers = (list: any[]) => {
    setUsers(list);
    localStorage.setItem('profitnet_users', JSON.stringify(list));
  };

  const handleWithdraw = (u: any) => {
    // choose payment method first
    const methodInput = prompt('Select mobile payment method (mpesa / tigopesa / airtelmoney)', 'mpesa');
    if (!methodInput) return;
    const method = methodInput.toLowerCase();
    const input = prompt(`Withdraw amount from ${u.name} (Balance: ${u.balance})`, '10000');
    if (!input) return;
    const amount = Number(input);
    if (isNaN(amount) || amount <= 0) {
      alert('Invalid amount.');
      return;
    }
    if (amount > u.balance) {
      alert('Amount exceeds user balance.');
      return;
    }

    // Deduct balance
    const updatedUsers = users.map(user => (user.id === u.id ? { ...user, balance: user.balance - amount } : user));
    saveUsers(updatedUsers);

    // Record transaction for the user
    const txKey = `transactions_${u.id}`;
    const tx: any[] = JSON.parse(localStorage.getItem(txKey) || '[]');
    tx.push({
      method,
      id: Date.now().toString(),
      type: 'withdrawal',
      amount,
      status: 'completed',
      adminProcessed: true,
      createdAt: new Date(),
    });
    localStorage.setItem(txKey, JSON.stringify(tx));

    alert('Withdrawal recorded.');
  };

  const filtered = users.filter(u =>
    [u.name, u.email, u.phone].some((f: string) => f.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
        <h1 className="text-xl font-bold">Withdraw Money</h1>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search user..."
          className="px-2 py-1 text-sm border rounded"
        />
      </div>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-center">Phone</th>
              <th className="px-4 py-2 text-center">Balance</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{u.name}</td>
                <td className="px-4 py-2">{u.email}</td>
                <td className="px-4 py-2 text-center">{u.phone}</td>
                <td className="px-4 py-2 text-center">{u.balance.toLocaleString()}</td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => handleWithdraw(u)}
                    className="px-2 py-1 text-xs bg-purple-600 text-white rounded inline-flex items-center gap-1"
                  >
                    <ArrowDownCircle size={14} /> Withdraw
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">No users found.</div>
        )}
      </div>
    </div>
  );
};

export default WithdrawPage;
