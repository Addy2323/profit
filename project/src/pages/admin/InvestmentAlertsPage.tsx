import React, { useState, useEffect } from 'react';
import {
  BellIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ArrowPathIcon,
  FunnelIcon,
  EyeIcon,
  TrashIcon,
  BellAlertIcon,
  ShieldExclamationIcon,
  CurrencyDollarIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

interface InvestmentAlert {
  id: string;
  type: 'warning' | 'error' | 'info' | 'success';
  category: 'payment' | 'performance' | 'user' | 'system' | 'security';
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  isRead: boolean;
  isResolved: boolean;
  affectedUsers?: number;
  relatedAmount?: number;
  actionRequired: boolean;
  source: string;
}

const InvestmentAlertsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState<InvestmentAlert[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<InvestmentAlert[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  useEffect(() => {
    loadAlerts();
  }, []);

  useEffect(() => {
    filterAlerts();
  }, [alerts, selectedCategory, selectedSeverity, showUnreadOnly]);

  const loadAlerts = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Sample alerts data
      const sampleAlerts: InvestmentAlert[] = [
        {
          id: '1',
          type: 'error',
          category: 'payment',
          title: 'Multiple Failed Withdrawal Attempts',
          message: 'User John Mwangi has 3 consecutive failed withdrawal attempts. Account may need verification.',
          severity: 'high',
          timestamp: '2024-08-05T18:30:00Z',
          isRead: false,
          isResolved: false,
          affectedUsers: 1,
          relatedAmount: 250000,
          actionRequired: true,
          source: 'Payment System'
        },
        {
          id: '2',
          type: 'warning',
          category: 'performance',
          title: 'VIP Plan Underperforming',
          message: 'VIP Investment Plan is showing 15% lower returns than projected for this month.',
          severity: 'medium',
          timestamp: '2024-08-05T17:45:00Z',
          isRead: false,
          isResolved: false,
          affectedUsers: 23,
          actionRequired: true,
          source: 'Analytics Engine'
        },
        {
          id: '3',
          type: 'info',
          category: 'user',
          title: 'High Volume Investment Activity',
          message: 'Unusual spike in new investments detected. 45 new investments in the last 2 hours.',
          severity: 'low',
          timestamp: '2024-08-05T16:20:00Z',
          isRead: true,
          isResolved: false,
          affectedUsers: 45,
          relatedAmount: 12500000,
          actionRequired: false,
          source: 'User Activity Monitor'
        },
        {
          id: '4',
          type: 'error',
          category: 'security',
          title: 'Suspicious Login Pattern',
          message: 'Multiple login attempts from different locations detected for admin account.',
          severity: 'critical',
          timestamp: '2024-08-05T15:10:00Z',
          isRead: false,
          isResolved: false,
          actionRequired: true,
          source: 'Security Monitor'
        },
        {
          id: '5',
          type: 'success',
          category: 'system',
          title: 'Daily Returns Processed Successfully',
          message: 'All daily returns for 156 active investments have been processed and credited.',
          severity: 'low',
          timestamp: '2024-08-05T14:00:00Z',
          isRead: true,
          isResolved: true,
          affectedUsers: 156,
          relatedAmount: 2840000,
          actionRequired: false,
          source: 'Return Processing System'
        },
        {
          id: '6',
          type: 'warning',
          category: 'payment',
          title: 'Low Payment Gateway Balance',
          message: 'Payment gateway balance is below threshold. May affect withdrawal processing.',
          severity: 'high',
          timestamp: '2024-08-05T13:30:00Z',
          isRead: false,
          isResolved: false,
          actionRequired: true,
          source: 'Payment Gateway'
        }
      ];

      setAlerts(sampleAlerts);
    } catch (error) {
      console.error('Error loading alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAlerts = () => {
    let filtered = alerts;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(alert => alert.category === selectedCategory);
    }

    if (selectedSeverity !== 'all') {
      filtered = filtered.filter(alert => alert.severity === selectedSeverity);
    }

    if (showUnreadOnly) {
      filtered = filtered.filter(alert => !alert.isRead);
    }

    setFilteredAlerts(filtered);
  };

  const markAsRead = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, isRead: true } : alert
    ));
  };

  const markAsResolved = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, isResolved: true, isRead: true } : alert
    ));
  };

  const deleteAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const getAlertIcon = (type: string, category: string) => {
    if (category === 'security') return <ShieldExclamationIcon className="h-5 w-5" />;
    if (category === 'payment') return <CurrencyDollarIcon className="h-5 w-5" />;
    if (category === 'user') return <UserGroupIcon className="h-5 w-5" />;
    
    switch (type) {
      case 'error': return <XCircleIcon className="h-5 w-5" />;
      case 'warning': return <ExclamationTriangleIcon className="h-5 w-5" />;
      case 'success': return <CheckCircleIcon className="h-5 w-5" />;
      case 'info': return <BellIcon className="h-5 w-5" />;
      default: return <BellIcon className="h-5 w-5" />;
    }
  };

  const getAlertColor = (type: string, severity: string) => {
    if (severity === 'critical') return 'border-red-500 bg-red-50';
    
    switch (type) {
      case 'error': return 'border-red-300 bg-red-50';
      case 'warning': return 'border-yellow-300 bg-yellow-50';
      case 'success': return 'border-green-300 bg-green-50';
      case 'info': return 'border-blue-300 bg-blue-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const getIconColor = (type: string, severity: string) => {
    if (severity === 'critical') return 'text-red-600';
    
    switch (type) {
      case 'error': return 'text-red-500';
      case 'warning': return 'text-yellow-500';
      case 'success': return 'text-green-500';
      case 'info': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  const getSeverityBadge = (severity: string) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    };
    
    return colors[severity as keyof typeof colors] || colors.low;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const unreadCount = alerts.filter(alert => !alert.isRead).length;
  const criticalCount = alerts.filter(alert => alert.severity === 'critical').length;
  const actionRequiredCount = alerts.filter(alert => alert.actionRequired && !alert.isResolved).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ArrowPathIcon className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading alerts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🔔 Investment Alerts</h1>
          <p className="text-gray-600">Monitor and manage system alerts and notifications</p>
        </div>

        {/* Alert Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unread Alerts</p>
                <p className="text-2xl font-bold text-blue-600">{unreadCount}</p>
              </div>
              <BellIcon className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Critical Alerts</p>
                <p className="text-2xl font-bold text-red-600">{criticalCount}</p>
              </div>
              <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Action Required</p>
                <p className="text-2xl font-bold text-orange-600">{actionRequiredCount}</p>
              </div>
              <BellAlertIcon className="h-8 w-8 text-orange-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Alerts</p>
                <p className="text-2xl font-bold text-gray-900">{alerts.length}</p>
              </div>
              <ClockIcon className="h-8 w-8 text-gray-500" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <FunnelIcon className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="payment">Payment</option>
              <option value="performance">Performance</option>
              <option value="user">User Activity</option>
              <option value="system">System</option>
              <option value="security">Security</option>
            </select>

            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showUnreadOnly}
                onChange={(e) => setShowUnreadOnly(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Unread only</span>
            </label>

            <button
              onClick={loadAlerts}
              className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <ArrowPathIcon className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-4">
          {filteredAlerts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <BellIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No alerts found</h3>
              <p className="text-gray-500">All clear! No alerts match your current filters.</p>
            </div>
          ) : (
            filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`border-l-4 rounded-lg shadow-sm p-6 ${getAlertColor(alert.type, alert.severity)} ${
                  !alert.isRead ? 'ring-2 ring-blue-200' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className={`flex-shrink-0 ${getIconColor(alert.type, alert.severity)}`}>
                      {getAlertIcon(alert.type, alert.category)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className={`text-lg font-semibold ${!alert.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                          {alert.title}
                        </h3>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityBadge(alert.severity)}`}>
                          {alert.severity.toUpperCase()}
                        </span>
                        {alert.actionRequired && !alert.isResolved && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                            ACTION REQUIRED
                          </span>
                        )}
                        {alert.isResolved && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            RESOLVED
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-700 mb-3">{alert.message}</p>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <ClockIcon className="h-4 w-4" />
                          {new Date(alert.timestamp).toLocaleString()}
                        </span>
                        <span>Source: {alert.source}</span>
                        {alert.affectedUsers && (
                          <span>{alert.affectedUsers} users affected</span>
                        )}
                        {alert.relatedAmount && (
                          <span>Amount: {formatCurrency(alert.relatedAmount)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    {!alert.isRead && (
                      <button
                        onClick={() => markAsRead(alert.id)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Mark as read"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                    )}
                    
                    {!alert.isResolved && alert.actionRequired && (
                      <button
                        onClick={() => markAsResolved(alert.id)}
                        className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                        title="Mark as resolved"
                      >
                        <CheckCircleIcon className="h-4 w-4" />
                      </button>
                    )}
                    
                    <button
                      onClick={() => deleteAlert(alert.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      title="Delete alert"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination or Load More could go here */}
        {filteredAlerts.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Showing {filteredAlerts.length} of {alerts.length} alerts
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestmentAlertsPage;
