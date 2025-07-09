import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const WithdrawalPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');


  const handleWithdraw = () => {
    const numericAmount = Number(amount);
    const balance = user?.balance ?? 0;

    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      setError('Please enter a valid amount.');
      return;
    }
    if (numericAmount < 3000) {
      setError('Minimum withdrawal is 3,000 TZS.');
      return;
    }
    if (numericAmount > balance) {
      setError('Insufficient balance.');
      return;
    }

    // Record withdrawal as a pending transaction and deduct balance immediately.
    // Deduct balance
    if(user){
      const newBalance = (user.balance || 0) - numericAmount;
      updateUser({balance:newBalance});
      // also update in users list
      try{
        const users = JSON.parse(localStorage.getItem('profitnet_users') || '[]');
        const idx = users.findIndex((u:any)=>u.id===user.id);
        if(idx!==-1){
          users[idx].balance = newBalance;
          localStorage.setItem('profitnet_users',JSON.stringify(users));
        }
      }catch(e){ console.error(e); }
    }

    const tx = {
      id: Date.now().toString(),
      userId: user?.id || '',
      type: 'withdrawal' as const,
      amount: numericAmount,
      description: 'Withdrawal request',
      status: 'pending' as const,
      createdAt: new Date(),
    };
    const existing = JSON.parse(localStorage.getItem(`transactions_${user?.id}`) || '[]');
    existing.unshift(tx);
    localStorage.setItem(`transactions_${user?.id}`, JSON.stringify(existing));

    setError('');
    alert('Withdrawal request submitted and pending admin approval.');
    navigate('/withdrawal-log');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 px-4 py-4 flex items-center">
        <button onClick={() => navigate(-1)} className="mr-4">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-lg font-semibold">Withdrawal</h1>
      </div>

      <div className="p-4">
        {/* Main Card */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6 shadow-lg">
          {/* Account balance */}
          <div className="text-gray-400 text-sm mb-1">Account balance</div>
          <div className="text-4xl font-semibold mb-4">{user?.balance?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</div>
          {/* Amount input */}
          <div className="flex items-center gap-2 mb-6">
            <span className="text-xl font-bold">TZS</span>
            <input
              type="number"
              min={0}
              placeholder="5000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 bg-gray-700 text-white placeholder-gray-400 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
          {error && <div className="text-red-500 text-sm mb-4 text-center">{error}</div>}
          {/* Submit */}
          <button
            onClick={handleWithdraw}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:opacity-90 text-black font-semibold py-2 rounded-md transition-opacity"
          >
            Submit
          </button>
        </div>

        {/* Info list */}
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-300">
          <li>Withdrawal request time is Monday to Sunday 9:00 to 21:00, once you request a withdrawal, the funds will arrive in your account within 24 hours. Please be patient, as network fluctuations may cause your payment to take longer to arrive.</li>
          <li>Your account must have our company's products before you can apply for a withdrawal</li>
          <li>The minimum withdrawal amount is 3,000 TZS</li>
          <li>The withdrawal fee is 6%</li>
          <li>If you have any questions about the withdrawal method, please contact Telegram customer service in time</li>
        </ol>
      </div>
    </div>
  );
};

export default WithdrawalPage;