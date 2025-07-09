import React from 'react';

interface Props {
  user: any;
  onClose: () => void;
  onBalanceUpdate: (newBalance: number) => void;
}

const UserDrawer: React.FC<Props> = ({ user, onClose, onBalanceUpdate }) => {
  if (!user) return null;

  const purchases = JSON.parse(localStorage.getItem(`purchases_${user.id}`) || '[]');
  const transactions = JSON.parse(localStorage.getItem(`transactions_${user.id}`) || '[]');

  const adjustBalance = () => {
    const val = prompt('New balance', user.balance);
    if (val === null) return;
    onBalanceUpdate(Number(val));
  };

  return (
    <div className="fixed inset-0 z-40 flex">
      {/* overlay */}
      <div className="flex-1 bg-black/50" onClick={onClose} />
      {/* drawer */}
      <div className="w-full max-w-md bg-white shadow-xl p-4 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-2">User Details</h2>
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500">✕</button>

        <div className="space-y-1 text-sm">
          <p><span className="font-medium">Name:</span> {user.name}</p>
          <p><span className="font-medium">Email:</span> {user.email}</p>
          <p><span className="font-medium">Phone:</span> {user.phone}</p>
          <p><span className="font-medium">Role:</span> {user.role}</p>
          <p><span className="font-medium">Balance:</span> {user.balance.toLocaleString()}</p>
          <p><span className="font-medium">Created:</span> {new Date(user.createdAt).toLocaleDateString()}</p>
        </div>

        <button onClick={adjustBalance} className="mt-3 px-3 py-1 bg-green-600 text-white rounded text-sm">Adjust Balance</button>

        <h3 className="mt-4 font-semibold">Recent Purchases</h3>
        <ul className="list-disc ml-5 text-sm space-y-1 max-h-40 overflow-y-auto">
          {purchases.length === 0 && <li className="list-none text-gray-500">None</li>}
          {purchases.slice(0,10).map((p:any)=>(
            <li key={p.id}>{p.product.name} – {new Date(p.purchaseDate).toLocaleDateString()}</li>
          ))}
        </ul>

        <h3 className="mt-4 font-semibold">Recent Transactions</h3>
        <ul className="list-disc ml-5 text-sm space-y-1 max-h-40 overflow-y-auto">
          {transactions.length === 0 && <li className="list-none text-gray-500">None</li>}
          {transactions.slice(0,10).map((t:any)=>(
            <li key={t.id}>{t.type} {t.amount} – {t.status}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserDrawer;
