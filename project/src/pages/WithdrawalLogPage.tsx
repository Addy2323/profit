import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';

/**
 * Shows list of the current user's withdrawal transactions.
 * Pending withdrawals are highlighted so the user knows they are still being processed.
 */
const WithdrawalLogPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`transactions_${user.id}`);
      if (stored) {
        const all = JSON.parse(stored);
        setTransactions(all.filter((t: any) => t.type === 'withdrawal'));
      }
    }
  }, [user]);

  const statusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400';
      case 'pending':
        return 'text-yellow-400';
      case 'rejected':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const statusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Successful';
      case 'pending':
        return 'In progress';
      case 'rejected':
        return 'Rejected';
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
        <h1 className="text-lg font-semibold">Withdrawal records</h1>
      </div>

      {/* List */}
      <div className="p-4">
        {transactions.length ? (
          <div className="space-y-4">
            {transactions.map((tx) => (
              <div key={tx.id} className="bg-gray-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2 text-sm text-gray-400">
                  <span>Time</span>
                  <span>{format(new Date(tx.createdAt), 'MM-dd HH:mm:ss')}</span>
                </div>

                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">{tx.id}</span>
                  <span className="text-lg font-bold text-orange-400">-TZS{tx.amount.toLocaleString()}</span>
                </div>

                <div className={`text-sm font-medium ${statusColor(tx.status)} text-right`}>
                  {statusText(tx.status)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">No withdrawal records yet.</div>
        )}
      </div>
    </div>
  );
};

export default WithdrawalLogPage;
