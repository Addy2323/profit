import React, { useState, useEffect } from 'react';
import { AutoPaymentService, PaymentTransaction } from '../../services/AutoPaymentService';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon,
  CurrencyDollarIcon,
  PhoneIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const PaymentSystemPage: React.FC = () => {
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [paymentNumbers, setPaymentNumbers] = useState(AutoPaymentService.getPaymentNumbers());
  const [selectedTab, setSelectedTab] = useState<'transactions' | 'numbers'>('transactions');
  const [transactionFilter, setTransactionFilter] = useState<'all' | 'pending'>('pending');

  useEffect(() => {
    loadTransactions();
  }, [transactionFilter]);

  const loadTransactions = () => {
    let filteredTransactions: PaymentTransaction[];
    
    if (transactionFilter === 'pending') {
      filteredTransactions = AutoPaymentService.getPendingTransactions();
    } else {
      filteredTransactions = AutoPaymentService.getTransactionHistory();
    }
    
    setTransactions(filteredTransactions.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ));
  };

  const handleConfirmTransaction = async (transactionId: string) => {
    const result = AutoPaymentService.confirmTransaction(transactionId);
    if (result.success) {
      loadTransactions();
      alert(result.message);
    } else {
      alert(result.message);
    }
  };

  const handleRejectTransaction = async (transactionId: string) => {
    const reason = prompt('Enter rejection reason (optional):');
    const result = AutoPaymentService.rejectTransaction(transactionId, reason || undefined);
    if (result.success) {
      loadTransactions();
      alert(result.message);
    } else {
      alert(result.message);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          🚀 Automatic Payment System
        </h1>
        <p className="text-gray-600">
          Monitor and manage automatic payment processing and transaction validation
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Confirmed Today</p>
              <p className="text-2xl font-bold text-gray-900">
                {transactions.filter(t => 
                  t.status === 'confirmed' && 
                  new Date(t.timestamp).toDateString() === new Date().toDateString()
                ).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <ClockIcon className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {transactions.filter(t => t.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CurrencyDollarIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Amount Today</p>
              <p className="text-2xl font-bold text-gray-900">
                TZS {transactions
                  .filter(t => 
                    t.status === 'confirmed' && 
                    new Date(t.timestamp).toDateString() === new Date().toDateString()
                  )
                  .reduce((sum, t) => sum + t.amount, 0)
                  .toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <PhoneIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Numbers</p>
              <p className="text-2xl font-bold text-gray-900">
                {paymentNumbers.filter(n => n.isActive).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setSelectedTab('transactions')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedTab === 'transactions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <DocumentTextIcon className="w-5 h-5 inline mr-2" />
              Transaction History
            </button>
            <button
              onClick={() => setSelectedTab('numbers')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedTab === 'numbers'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <PhoneIcon className="w-5 h-5 inline mr-2" />
              Payment Numbers
            </button>
          </nav>
        </div>

        <div className="p-6">
          {selectedTab === 'transactions' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Transaction Management</h3>
                <button
                  onClick={loadTransactions}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Refresh
                </button>
              </div>
              
              {/* Transaction Filter Tabs */}
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setTransactionFilter('pending')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      transactionFilter === 'pending'
                        ? 'border-orange-500 text-orange-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <ClockIcon className="w-4 h-4 inline mr-1" />
                    Pending Approval ({AutoPaymentService.getPendingTransactions().length})
                  </button>
                  <button
                    onClick={() => setTransactionFilter('all')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      transactionFilter === 'all'
                        ? 'border-gray-500 text-gray-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <DocumentTextIcon className="w-4 h-4 inline mr-1" />
                    All Transactions
                  </button>
                </nav>
              </div>

              {transactions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No transactions found
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Request ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Method
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {transactions.map((transaction) => {
                        const getNetworkName = (network: string) => {
                          switch (network.toLowerCase()) {
                            case 'vodacom': return 'Vodacom M-Pesa';
                            case 'tigo': return 'Tigo Pesa';
                            case 'airtel': return 'Airtel Money';
                            default: return 'Mobile Money';
                          }
                        };
                        
                        const getNetworkColor = (network: string) => {
                          switch (network.toLowerCase()) {
                            case 'vodacom': return 'text-red-600 bg-red-50';
                            case 'tigo': return 'text-blue-600 bg-blue-50';
                            case 'airtel': return 'text-orange-600 bg-orange-50';
                            default: return 'text-gray-600 bg-gray-50';
                          }
                        };
                        
                        return (
                        <tr key={transaction.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col">
                              <div className="text-sm font-mono text-gray-900">
                                {transaction.transactionId}
                              </div>
                              <div className="text-xs text-gray-500 flex items-center mt-1">
                                <PhoneIcon className="w-3 h-3 mr-1" />
                                {transaction.senderNumber || 'N/A'}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              TZS {transaction.amount.toLocaleString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getNetworkColor(transaction.network)}`}>
                              {getNetworkName(transaction.network)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                              {getStatusIcon(transaction.status)}
                              <span className="ml-1 capitalize">{transaction.status}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(transaction.timestamp).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {transaction.status === 'pending' ? (
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleConfirmTransaction(transaction.id)}
                                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-xs font-medium"
                                >
                                  ✓ Confirm
                                </button>
                                <button
                                  onClick={() => handleRejectTransaction(transaction.id)}
                                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-xs font-medium"
                                >
                                  ✗ Reject
                                </button>
                              </div>
                            ) : (
                              <span className="text-gray-400 text-xs">
                                {transaction.status === 'confirmed' ? 'Confirmed' : 
                                 transaction.status === 'failed' ? `Rejected${transaction.rejectionReason ? `: ${transaction.rejectionReason}` : ''}` : 
                                 'N/A'}
                              </span>
                            )}
                          </td>
                        </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Payment Numbers Configuration</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {paymentNumbers.map((number) => (
                  <div key={number.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">{number.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        number.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {number.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Network:</span> {number.network}
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Number:</span> 
                        <span className="font-mono ml-1">{number.number}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">💡 System Features</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Automatic transaction validation with mobile money providers</li>
                  <li>• Real-time balance updates upon payment confirmation</li>
                  <li>• Duplicate transaction prevention</li>
                  <li>• Network-specific transaction ID validation</li>
                  <li>• Comprehensive transaction logging and history</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentSystemPage;
