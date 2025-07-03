import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const WithdrawalPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [amount, setAmount] = useState('');

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
        <div className="text-center py-12">
          <div className="text-gray-400 mb-2">Withdrawal feature</div>
          <div className="text-sm text-gray-500">Coming soon...</div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalPage;