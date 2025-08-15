import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { showSuccessAlert, showErrorAlert } from '../utils/alertUtils';
import { AutoPaymentService } from '../services/AutoPaymentService';

const WithdrawalPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const handleWithdraw = () => {
    const numericAmount = Number(amount);
    const balance = user?.balance ?? 0;

    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      showErrorAlert('Please enter a valid withdrawal amount.');
      return;
    }
    if (numericAmount < 3000) {
      showErrorAlert('Minimum withdrawal amount is 3,000 TZS. Please enter a higher amount.');
      return;
    }
    if (numericAmount > balance) {
      showErrorAlert(`Insufficient balance. Your current balance is ${balance.toLocaleString()} TZS.`);
      return;
    }

    if (!user?.id) {
      showErrorAlert('User not found. Please log in again.');
      return;
    }

    // Create withdrawal request using AutoPaymentService
    const result = AutoPaymentService.createWithdrawalRequest(
      user.id,
      numericAmount,
      'Mobile Money', // Default method
      {
        phoneNumber: user.phone || user.email, // Use phone or email as fallback
        requestedAt: new Date().toISOString()
      }
    );

    if (result.success) {
      // Update user balance in context
      const newBalance = (user.balance || 0) - numericAmount;
      updateUser({ balance: newBalance });
      
      setError('');
      setAmount('');
      showSuccessAlert(result.message);
      navigate('/withdrawal-log');
    } else {
      showErrorAlert(result.message);
    }
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
          <li>Withdrawal request time is Monday to Friday 9:00 to 21:00, once you request a withdrawal, the funds will arrive in your account within 24 hours. Please be patient, as network fluctuations may cause your payment to take longer to arrive.</li>
          <li>Your account must have our company's products before you can apply for a withdrawal</li>
          <li>The minimum withdrawal amount is 3,000 TZS</li>
          <li>The withdrawal fee is 6%</li>
          <li>If you have any questions about the withdrawal method, please contact WhatsApp customer service in time</li>
        </ol>
      </div>
    </div>
  );
};

export default WithdrawalPage;