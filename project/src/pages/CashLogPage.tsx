import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';

const CashLogPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      const storedTransactions = localStorage.getItem(`transactions_${user.id}`);
      if (storedTransactions) {
        // For cash log, we display all transactions, sorted by date
        const allTransactions = JSON.parse(storedTransactions);
        allTransactions.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setTransactions(allTransactions);
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

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'recharge':
        return 'text-green-400';
      case 'withdrawal':
        return 'text-red-400';
      case 'purchase':
        return 'text-orange-400';
      default:
        return 'text-blue-400';
    }
  }

  const getTransactionTypeText = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 px-4 py-4 flex items-center sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="mr-4">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-lg font-semibold">Cash Log</h1>
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
                  <div className={`text-lg font-bold ${transaction.type === 'recharge' ? 'text-green-400' : 'text-red-400'}`}>
                    {transaction.type === 'recharge' ? '+' : '-'}{transaction.amount.toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                   <div className={`text-sm font-medium ${getTransactionTypeColor(transaction.type)}`}>
                    {getTransactionTypeText(transaction.type)}
                  </div>
                  <div className={`text-sm font-medium ${getStatusColor(transaction.status)}`}>
                    {getStatusText(transaction.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">No cash log records found</div>
            <div className="text-sm text-gray-500">Your transaction history will appear here.</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CashLogPage;
