import React, { useState, useEffect } from 'react';
import { Search, Shield, Ban, CheckCircle, XCircle, Eye, AlertTriangle, Clock } from 'lucide-react';
import { UserManagementService } from '../../services/UserManagementService';
import { UserActivity, UserStatus, FraudAlert } from '../../types/UserManagement';
import { showSuccessAlert, showErrorAlert } from '../../utils/alertUtils';

const EnhancedUserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userActivities, setUserActivities] = useState<UserActivity[]>([]);
  const [fraudAlerts, setFraudAlerts] = useState<FraudAlert[]>([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [banReason, setBanReason] = useState('');

  useEffect(() => {
    loadUsers();
    loadFraudAlerts();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, filterStatus]);

  const loadUsers = () => {
    const allUsers = JSON.parse(localStorage.getItem('profitnet_users') || '[]');
    // Ensure each user has a status object
    const usersWithStatus = allUsers.map((user: any) => ({
      ...user,
      status: user.status || { isActive: true, isBanned: false }
    }));
    setUsers(usersWithStatus);
  };

  const loadFraudAlerts = () => {
    const alerts = UserManagementService.getFraudAlerts('pending');
    setFraudAlerts(alerts);
  };

  const filterUsers = () => {
    let filtered = users;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.mobile.includes(searchTerm)
      );
    }

    // Status filter
    switch (filterStatus) {
      case 'active':
        filtered = filtered.filter(user => user.status.isActive && !user.status.isBanned);
        break;
      case 'banned':
        filtered = filtered.filter(user => user.status.isBanned);
        break;
      case 'inactive':
        filtered = filtered.filter(user => !user.status.isActive);
        break;
    }

    setFilteredUsers(filtered);
  };

  const handleViewUser = (user: any) => {
    setSelectedUser(user);
    const activities = UserManagementService.getUserActivities(user.id);
    setUserActivities(activities);
    setShowUserModal(true);
  };

  const handleBanUser = (user: any) => {
    setSelectedUser(user);
    setShowBanModal(true);
  };

  const confirmBanUser = () => {
    if (!selectedUser || !banReason.trim()) {
      showErrorAlert('Please provide a reason for banning this user.');
      return;
    }

    const success = UserManagementService.updateUserStatus(
      selectedUser.id,
      { isBanned: true, banReason: banReason.trim() },
      'admin' // In real app, get from auth context
    );

    if (success) {
      showSuccessAlert(`User ${selectedUser.name} has been banned successfully.`);
      loadUsers();
      setShowBanModal(false);
      setBanReason('');
    } else {
      showErrorAlert('Error banning user. Please try again.');
    }
  };

  const handleUnbanUser = (user: any) => {
    const success = UserManagementService.updateUserStatus(
      user.id,
      { isBanned: false, banReason: undefined },
      'admin'
    );

    if (success) {
      showSuccessAlert(`User ${user.name} has been unbanned successfully.`);
      loadUsers();
    } else {
      showErrorAlert('Error unbanning user. Please try again.');
    }
  };

  const handleToggleUserStatus = (user: any) => {
    const newStatus = !user.status.isActive;
    const success = UserManagementService.updateUserStatus(
      user.id,
      { isActive: newStatus },
      'admin'
    );

    if (success) {
      showSuccessAlert(`User ${user.name} has been ${newStatus ? 'activated' : 'deactivated'} successfully.`);
      loadUsers();
    } else {
      showErrorAlert('Error updating user status. Please try again.');
    }
  };

  const getStatusBadge = (user: any) => {
    if (user.status.isBanned) {
      return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">Banned</span>;
    }
    if (!user.status.isActive) {
      return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">Inactive</span>;
    }
    return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Active</span>;
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      user: 'bg-blue-100 text-blue-800',
      admin: 'bg-purple-100 text-purple-800',
      superadmin: 'bg-orange-100 text-orange-800'
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[role as keyof typeof colors] || colors.user}`}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Enhanced User Management</h1>
        <div className="flex items-center gap-4">
          {fraudAlerts.length > 0 && (
            <div className="flex items-center gap-2 bg-red-50 text-red-700 px-3 py-2 rounded-lg">
              <AlertTriangle size={16} />
              <span className="text-sm font-medium">{fraudAlerts.length} Fraud Alerts</span>
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search users by name, email, or mobile..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Users</option>
              <option value="active">Active Users</option>
              <option value="inactive">Inactive Users</option>
              <option value="banned">Banned Users</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                      <div className="text-sm text-gray-500">{user.mobile}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(user)}
                    {user.status.isBanned && user.status.banReason && (
                      <div className="text-xs text-red-600 mt-1">
                        Reason: {user.status.banReason}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.balance?.toLocaleString() || '0'} TZS
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.createdAt || new Date())}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewUser(user)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      
                      {user.status.isBanned ? (
                        <button
                          onClick={() => handleUnbanUser(user)}
                          className="text-green-600 hover:text-green-900 p-1"
                          title="Unban User"
                        >
                          <CheckCircle size={16} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleBanUser(user)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Ban User"
                        >
                          <Ban size={16} />
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleToggleUserStatus(user)}
                        className={`p-1 ${user.status.isActive ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'}`}
                        title={user.status.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {user.status.isActive ? <XCircle size={16} /> : <CheckCircle size={16} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No users found matching your criteria.
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">User Details: {selectedUser.name}</h2>
              <button
                onClick={() => setShowUserModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* User Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold mb-3">User Information</h3>
                <div className="space-y-2 text-sm">
                  <div><strong>Name:</strong> {selectedUser.name}</div>
                  <div><strong>Email:</strong> {selectedUser.email}</div>
                  <div><strong>Mobile:</strong> {selectedUser.mobile}</div>
                  <div><strong>Role:</strong> {getRoleBadge(selectedUser.role)}</div>
                  <div><strong>Status:</strong> {getStatusBadge(selectedUser)}</div>
                  <div><strong>Balance:</strong> {selectedUser.balance?.toLocaleString() || '0'} TZS</div>
                  <div><strong>Joined:</strong> {formatDate(selectedUser.createdAt || new Date())}</div>
                </div>
              </div>

              {/* Recent Activities */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold mb-3">Recent Activities</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {userActivities.slice(0, 10).map((activity) => (
                    <div key={activity.id} className="text-sm border-b border-gray-200 pb-2">
                      <div className="flex justify-between items-start">
                        <span className="font-medium">{activity.action}</span>
                        <span className="text-gray-500 text-xs">{formatDate(activity.timestamp)}</span>
                      </div>
                      <div className="text-gray-600 text-xs mt-1">{activity.details}</div>
                    </div>
                  ))}
                  {userActivities.length === 0 && (
                    <div className="text-gray-500 text-sm">No activities recorded</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ban User Modal */}
      {showBanModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Ban User: {selectedUser.name}</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for banning (required)
              </label>
              <textarea
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                placeholder="Enter the reason for banning this user..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                rows={4}
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={confirmBanUser}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg"
              >
                Ban User
              </button>
              <button
                onClick={() => {
                  setShowBanModal(false);
                  setBanReason('');
                }}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedUserManagementPage;
