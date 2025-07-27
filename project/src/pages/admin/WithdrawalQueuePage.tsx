import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, DollarSign, User, Calendar, AlertTriangle, Phone as PhoneIcon } from 'lucide-react';
import { AutoPaymentService, WithdrawalRequest } from '../../services/AutoPaymentService';
import { showSuccessAlert, showErrorAlert } from '../../utils/alertUtils';

const WithdrawalQueuePage: React.FC = () => {
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<WithdrawalRequest[]>([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState<WithdrawalRequest | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
    totalAmount: 0,
    pendingAmount: 0
  });

  useEffect(() => {
    loadWithdrawalRequests();
  }, []);

  useEffect(() => {
    filterRequests();
    calculateStats();
  }, [withdrawalRequests, filterStatus]);

  const loadWithdrawalRequests = () => {
    const requests = AutoPaymentService.getWithdrawalRequests();
    setWithdrawalRequests(requests);
  };

  const filterRequests = () => {
    let filtered = withdrawalRequests;

    if (filterStatus !== 'all') {
      filtered = filtered.filter(request => request.status === filterStatus);
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());

    setFilteredRequests(filtered);
  };

  const calculateStats = () => {
    const totalAmount = withdrawalRequests.reduce((sum, req) => sum + req.amount, 0);
    const pendingAmount = withdrawalRequests
      .filter(req => req.status === 'pending')
      .reduce((sum, req) => sum + req.amount, 0);

    setStats({
      totalRequests: withdrawalRequests.length,
      pendingRequests: withdrawalRequests.filter(req => req.status === 'pending').length,
      approvedRequests: withdrawalRequests.filter(req => req.status === 'approved').length,
      rejectedRequests: withdrawalRequests.filter(req => req.status === 'rejected').length,
      totalAmount,
      pendingAmount
    });
  };

  const handleViewRequest = (request: WithdrawalRequest) => {
    setSelectedRequest(request);
    setRejectionReason('');
    setShowDetailModal(true);
  };

  const handleApproveRequest = async () => {
    if (!selectedRequest) return;

    const result = AutoPaymentService.approveWithdrawal(selectedRequest.id, 'admin');

    if (result.success) {
      showSuccessAlert(result.message);
      loadWithdrawalRequests();
      setShowDetailModal(false);
    } else {
      showErrorAlert(result.message);
    }
  };

  const handleRejectRequest = () => {
    if (!selectedRequest) return;

    if (!rejectionReason.trim()) {
      showErrorAlert('Please provide a reason for rejection.');
      return;
    }

    const result = AutoPaymentService.rejectWithdrawal(selectedRequest.id, rejectionReason, 'admin');

    if (result.success) {
      showSuccessAlert(result.message);
      loadWithdrawalRequests();
      setShowDetailModal(false);
      setRejectionReason('');
    } else {
      showErrorAlert(result.message);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="text-yellow-500" size={16} />;
      case 'approved': return <CheckCircle className="text-green-500" size={16} />;
      case 'rejected': return <XCircle className="text-red-500" size={16} />;
      default: return <Clock className="text-gray-500" size={16} />;
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getUserName = (userId: string) => {
    const users = JSON.parse(localStorage.getItem('profitnet_users') || '[]');
    const user = users.find((u: any) => u.id === userId);
    return user ? user.name : 'Unknown User';
  };

  const getUserBalance = (userId: string) => {
    const users = JSON.parse(localStorage.getItem('profitnet_users') || '[]');
    const user = users.find((u: any) => u.id === userId);
    return user ? (user.balance || 0) : 0;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Withdrawal Queue Management</h1>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="text-blue-500" size={20} />
          <span>{stats.pendingRequests} Pending Requests</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Total Requests</p>
              <p className="text-xl font-bold text-gray-900">{stats.totalRequests}</p>
            </div>
            <DollarSign className="text-gray-400" size={20} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Pending</p>
              <p className="text-xl font-bold text-yellow-600">{stats.pendingRequests}</p>
            </div>
            <Clock className="text-yellow-400" size={20} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Approved</p>
              <p className="text-xl font-bold text-green-600">{stats.approvedRequests}</p>
            </div>
            <CheckCircle className="text-green-400" size={20} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Rejected</p>
              <p className="text-xl font-bold text-red-600">{stats.rejectedRequests}</p>
            </div>
            <XCircle className="text-red-400" size={20} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Total Amount</p>
              <p className="text-xl font-bold text-gray-900">TZS {stats.totalAmount.toLocaleString()}</p>
            </div>
            <DollarSign className="text-gray-400" size={20} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Pending Amount</p>
              <p className="text-xl font-bold text-yellow-600">TZS {stats.pendingAmount.toLocaleString()}</p>
            </div>
            <Clock className="text-yellow-400" size={20} />
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex items-center gap-4">
          <label className="block text-sm font-medium text-gray-700">Filter by Status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Balance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.map((request) => {
                const userBalance = getUserBalance(request.userId);
                const hasInsufficientFunds = request.amount > userBalance;
                
                const getMethodName = (method: string) => {
                  switch (method.toLowerCase()) {
                    case 'vodacom':
                    case 'mpesa':
                    case 'm-pesa': return 'Vodacom M-Pesa';
                    case 'tigo':
                    case 'tigo pesa': return 'Tigo Pesa';
                    case 'airtel':
                    case 'airtel money': return 'Airtel Money';
                    case 'bank': return 'Bank Transfer';
                    case 'paypal': return 'PayPal';
                    default: return method;
                  }
                };
                
                const getMethodColor = (method: string) => {
                  switch (method.toLowerCase()) {
                    case 'vodacom':
                    case 'mpesa':
                    case 'm-pesa': return 'text-red-600 bg-red-50';
                    case 'tigo':
                    case 'tigo pesa': return 'text-blue-600 bg-blue-50';
                    case 'airtel':
                    case 'airtel money': return 'text-orange-600 bg-orange-50';
                    case 'bank': return 'text-green-600 bg-green-50';
                    case 'paypal': return 'text-purple-600 bg-purple-50';
                    default: return 'text-gray-600 bg-gray-50';
                  }
                };
                
                return (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="text-sm font-mono text-gray-900">
                          #{request.id.slice(-8).toUpperCase()}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center mt-1">
                          <User className="w-3 h-3 mr-1" />
                          {getUserName(request.userId)}
                        </div>
                        {request.details?.phoneNumber && (
                          <div className="text-xs text-gray-500 flex items-center mt-1">
                            <PhoneIcon className="w-3 h-3 mr-1" />
                            {request.details.phoneNumber}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-900">
                          TZS {request.amount.toLocaleString()}
                        </span>
                        {hasInsufficientFunds && request.status === 'pending' && (
                          <AlertTriangle className="text-red-500" size={16} title="Insufficient funds" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getMethodColor(request.method)}`}>
                        {getMethodName(request.method)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(request.status)}
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        {formatDate(request.requestedAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${hasInsufficientFunds ? 'text-red-600' : 'text-green-600'}`}>
                        TZS {userBalance.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewRequest(request)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredRequests.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No withdrawal requests found matching your criteria.
          </div>
        )}
      </div>

      {/* Request Detail Modal */}
      {showDetailModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Withdrawal Request Details</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">User</label>
                    <p className="text-sm mt-1">{getUserName(selectedRequest.userId)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Amount</label>
                    <p className="text-sm font-bold mt-1">${selectedRequest.amount.toFixed(2)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Method</label>
                    <p className="text-sm mt-1">{selectedRequest.method}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusIcon(selectedRequest.status)}
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedRequest.status)}`}>
                        {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Requested At</label>
                    <p className="text-sm mt-1">{formatDate(selectedRequest.requestedAt)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">User Balance</label>
                    <p className={`text-sm font-medium mt-1 ${selectedRequest.amount > getUserBalance(selectedRequest.userId) ? 'text-red-600' : 'text-green-600'}`}>
                      ${getUserBalance(selectedRequest.userId).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {selectedRequest.details && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Details</label>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <pre className="text-sm text-gray-600 whitespace-pre-wrap">
                      {JSON.stringify(selectedRequest.details, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {selectedRequest.status === 'rejected' && selectedRequest.rejectionReason && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rejection Reason</label>
                  <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                    {selectedRequest.rejectionReason}
                  </p>
                </div>
              )}

              {selectedRequest.status === 'pending' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rejection Reason (if rejecting)</label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Enter reason for rejection..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>
              )}

              {selectedRequest.amount > getUserBalance(selectedRequest.userId) && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="text-red-500" size={20} />
                    <span className="text-red-700 font-medium">Insufficient Funds Warning</span>
                  </div>
                  <p className="text-red-600 text-sm mt-1">
                    User's current balance (${getUserBalance(selectedRequest.userId).toFixed(2)}) is insufficient for this withdrawal amount (${selectedRequest.amount.toFixed(2)}).
                  </p>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                {selectedRequest.status === 'pending' && (
                  <>
                    <button
                      onClick={handleApproveRequest}
                      disabled={selectedRequest.amount > getUserBalance(selectedRequest.userId)}
                      className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={16} />
                      Approve Request
                    </button>
                    <button
                      onClick={handleRejectRequest}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2"
                    >
                      <XCircle size={16} />
                      Reject Request
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WithdrawalQueuePage;
