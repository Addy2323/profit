import React, { useState, useEffect } from 'react';
import { ArrowLeft, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';

const RechargeLogPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      const storedTransactions = localStorage.getItem(`transactions_${user.id}`);
      if (storedTransactions) {
        const allTransactions = JSON.parse(storedTransactions);
        const rechargeTransactions = allTransactions.filter((t: any) => t.type === 'recharge');
        setTransactions(rechargeTransactions);
      }
    }
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400';
      case 'pending':
        return 'text-yellow-400';
      case 'failed':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Successful';
      case 'pending':
        return 'In progress';
      case 'failed':
        return 'Failed';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 px-4 py-4 flex items-center">
        <button onClick={() => navigate(-1)} className="mr-4">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-lg font-semibold">Recharge log</h1>
      </div>

      {/* Transactions List */}
      <div className="p-4">
        {transactions.length > 0 ? (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="bg-gray-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-gray-400">Time</div>
                  <div className="text-sm text-gray-300">
                    {format(new Date(transaction.createdAt), 'MM-dd HH:mm:ss')}
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-gray-400">
                    {transaction.id}
                  </div>
                  <div className="text-lg font-bold text-orange-400">
                    TZS{transaction.amount.toLocaleString()}.00
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <button className="flex items-center space-x-1 bg-red-500 text-white px-3 py-1 rounded text-sm">
                    <Upload className="w-4 h-4" />
                    <span>Upload</span>
                  </button>
                  <div className={`text-sm font-medium ${getStatusColor(transaction.status)}`}>
                    {getStatusText(transaction.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">No recharge records found</div>
            <div className="text-sm text-gray-500">Start by making your first recharge</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RechargeLogPage;