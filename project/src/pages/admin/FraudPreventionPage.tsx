import React, { useState, useEffect } from 'react';
import { AlertTriangle, Shield, Eye, CheckCircle, XCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { UserManagementService } from '../../services/UserManagementService';
import { FraudAlert } from '../../types/UserManagement';
import { showSuccessAlert, showErrorAlert } from '../../utils/alertUtils';

const FraudPreventionPage: React.FC = () => {
  const [fraudAlerts, setFraudAlerts] = useState<FraudAlert[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<FraudAlert[]>([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [selectedAlert, setSelectedAlert] = useState<FraudAlert | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [resolution, setResolution] = useState('');
  const [stats, setStats] = useState({
    totalAlerts: 0,
    pendingAlerts: 0,
    resolvedAlerts: 0,
    criticalAlerts: 0
  });

  useEffect(() => {
    loadFraudAlerts();
  }, []);

  useEffect(() => {
    filterAlerts();
    calculateStats();
  }, [fraudAlerts, filterStatus, filterSeverity]);

  const loadFraudAlerts = () => {
    const alerts = UserManagementService.getFraudAlerts();
    setFraudAlerts(alerts);
  };

  const filterAlerts = () => {
    let filtered = fraudAlerts;

    if (filterStatus !== 'all') {
      filtered = filtered.filter(alert => alert.status === filterStatus);
    }

    if (filterSeverity !== 'all') {
      filtered = filtered.filter(alert => alert.severity === filterSeverity);
    }

    setFilteredAlerts(filtered);
  };

  const calculateStats = () => {
    setStats({
      totalAlerts: fraudAlerts.length,
      pendingAlerts: fraudAlerts.filter(alert => alert.status === 'pending').length,
      resolvedAlerts: fraudAlerts.filter(alert => alert.status === 'resolved').length,
      criticalAlerts: fraudAlerts.filter(alert => alert.severity === 'critical').length
    });
  };

  const handleViewAlert = (alert: FraudAlert) => {
    setSelectedAlert(alert);
    setResolution('');
    setShowDetailModal(true);
  };

  const handleResolveAlert = (status: 'resolved' | 'false_positive') => {
    if (!selectedAlert) return;

    if (status === 'resolved' && !resolution.trim()) {
      showErrorAlert('Please provide a resolution description.');
      return;
    }

    const success = UserManagementService.updateFraudAlert(selectedAlert.id, {
      status,
      investigatedBy: 'admin', // In real app, get from auth context
      resolution: status === 'resolved' ? resolution : 'Marked as false positive'
    });

    if (success) {
      showSuccessAlert(`Alert ${status === 'resolved' ? 'resolved' : 'marked as false positive'} successfully.`);
      loadFraudAlerts();
      setShowDetailModal(false);
    } else {
      showErrorAlert('Error updating alert status.');
    }
  };

  const handleInvestigateAlert = () => {
    if (!selectedAlert) return;

    const success = UserManagementService.updateFraudAlert(selectedAlert.id, {
      status: 'investigating',
      investigatedBy: 'admin'
    });

    if (success) {
      showSuccessAlert('Alert marked as under investigation.');
      loadFraudAlerts();
      setShowDetailModal(false);
    } else {
      showErrorAlert('Error updating alert status.');
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-blue-600 bg-blue-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'investigating': return 'text-blue-600 bg-blue-100';
      case 'resolved': return 'text-green-600 bg-green-100';
      case 'false_positive': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deposit_anomaly': return <TrendingUp className="text-green-500" size={16} />;
      case 'withdrawal_anomaly': return <TrendingDown className="text-red-500" size={16} />;
      case 'suspicious_pattern': return <AlertTriangle className="text-orange-500" size={16} />;
      case 'multiple_accounts': return <Shield className="text-purple-500" size={16} />;
      default: return <AlertTriangle className="text-gray-500" size={16} />;
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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Fraud Prevention Dashboard</h1>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Shield className="text-blue-500" size={20} />
          <span>Real-time Monitoring Active</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Alerts</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalAlerts}</p>
            </div>
            <AlertTriangle className="text-gray-400" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pendingAlerts}</p>
            </div>
            <AlertTriangle className="text-yellow-400" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-green-600">{stats.resolvedAlerts}</p>
            </div>
            <CheckCircle className="text-green-400" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Critical</p>
              <p className="text-2xl font-bold text-red-600">{stats.criticalAlerts}</p>
            </div>
            <AlertTriangle className="text-red-400" size={24} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="investigating">Investigating</option>
              <option value="resolved">Resolved</option>
              <option value="false_positive">False Positive</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Severity</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Alerts Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alert</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detected</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAlerts.map((alert) => (
                <tr key={alert.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      {getTypeIcon(alert.type)}
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {alert.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </div>
                        <div className="text-sm text-gray-500 max-w-xs truncate">
                          {alert.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getUserName(alert.userId)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(alert.severity)}`}>
                      {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(alert.status)}`}>
                      {alert.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(alert.detectedAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleViewAlert(alert)}
                      className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                    >
                      <Eye size={16} />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAlerts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No fraud alerts found matching your criteria.
          </div>
        )}
      </div>

      {/* Alert Detail Modal */}
      {showDetailModal && selectedAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Fraud Alert Details</h2>
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
                    <label className="block text-sm font-medium text-gray-700">Alert Type</label>
                    <div className="flex items-center gap-2 mt-1">
                      {getTypeIcon(selectedAlert.type)}
                      <span className="text-sm">
                        {selectedAlert.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Severity</label>
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 ${getSeverityColor(selectedAlert.severity)}`}>
                      {selectedAlert.severity.charAt(0).toUpperCase() + selectedAlert.severity.slice(1)}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">User</label>
                    <p className="text-sm mt-1">{getUserName(selectedAlert.userId)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Detected At</label>
                    <p className="text-sm mt-1">{formatDate(selectedAlert.detectedAt)}</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {selectedAlert.description}
                </p>
              </div>

              {selectedAlert.status === 'resolved' && selectedAlert.resolution && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Resolution</label>
                  <p className="text-sm text-gray-600 bg-green-50 p-3 rounded-lg">
                    {selectedAlert.resolution}
                  </p>
                </div>
              )}

              {selectedAlert.status === 'pending' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Resolution Notes</label>
                  <textarea
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    placeholder="Enter resolution details..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={4}
                  />
                </div>
              )}

              <div className="flex gap-4 pt-4">
                {selectedAlert.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleResolveAlert('resolved')}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={16} />
                      Mark as Resolved
                    </button>
                    <button
                      onClick={handleInvestigateAlert}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
                    >
                      Start Investigation
                    </button>
                    <button
                      onClick={() => handleResolveAlert('false_positive')}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg"
                    >
                      False Positive
                    </button>
                  </>
                )}
                {selectedAlert.status === 'investigating' && (
                  <button
                    onClick={() => handleResolveAlert('resolved')}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={16} />
                    Mark as Resolved
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FraudPreventionPage;
