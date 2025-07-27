import React, { useState, useEffect } from 'react';
import UserFormModal from '../../components/UserFormModal';
import { debugUsers } from '../../utils/debugUsers';
import { showSuccessAlert, showErrorAlert } from '../../utils/alertUtils';

const ManageUsersPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const refreshUsers = () => {
    const allUsers = JSON.parse(localStorage.getItem('profitnet_users') || '[]');
    setUsers(allUsers.filter((u: any) => u.role === 'user'));
  };

  useEffect(() => {
    refreshUsers();
  }, []);

  const handleAddUser = (formData: any) => {
    const allUsers = JSON.parse(localStorage.getItem('profitnet_users') || '[]');
    const newUser = {
      id: Date.now().toString(),
      ...formData,
      balance: Number(formData.balance) || 0,
      role: 'user',
      isActive: true,
      createdAt: new Date(),
      referralCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
    };
    const updatedUsers = [...allUsers, newUser];
    localStorage.setItem('profitnet_users', JSON.stringify(updatedUsers));
    refreshUsers();
    setIsModalOpen(false);
    showSuccessAlert(`User ${newUser.name} has been added successfully!`);
  };

  const handleEditUser = (formData: any) => {
    const allUsers = JSON.parse(localStorage.getItem('profitnet_users') || '[]');
    const updatedUsers = allUsers.map((u: any) => {
      if (u.id === editingUser.id) {
        const updatedUser = { ...u, ...formData, balance: Number(formData.balance) || 0 };
        if (!formData.password) {
          updatedUser.password = u.password; // Keep original password if not changed
        }
        return updatedUser;
      }
      return u;
    });
    localStorage.setItem('profitnet_users', JSON.stringify(updatedUsers));
    refreshUsers();
    closeModal();
    showSuccessAlert(`User ${formData.name} has been updated successfully!`);
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const allUsers = JSON.parse(localStorage.getItem('profitnet_users') || '[]');
      const updatedUsers = allUsers.filter((u: any) => u.id !== userId);
      localStorage.setItem('profitnet_users', JSON.stringify(updatedUsers));
      refreshUsers();
      showSuccessAlert('User has been deleted successfully.');
    }
  };

  return (
    <div className="text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-red-500">Manage Users</h1>
        <div className="flex space-x-3">
          <button 
            onClick={() => debugUsers()}
            className="bg-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300"
          >
            🐛 Debug Users
          </button>
          <button 
            onClick={() => {
              setEditingUser(null);
              setIsModalOpen(true);
            }}
            className="bg-green-600 px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-all duration-300"
          >
            Add New User
          </button>
        </div>
      </div>
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-600">
              <th className="p-3">ID</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Balance (TZS)</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                <td className="p-3 text-sm">{user.id}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.phone}</td>
                <td className="p-3">{user.balance.toLocaleString()}</td>
                <td className="p-3">
                  <button 
                    onClick={() => {
                      setEditingUser(user);
                      setIsModalOpen(true);
                    }}
                    className="text-blue-400 hover:text-blue-300 mr-3"
                  >
                    Edit
                  </button>
                  <button onClick={() => handleDeleteUser(user.id)} className="text-red-500 hover:text-red-400">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <UserFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={editingUser ? handleEditUser : handleAddUser}
        initialData={editingUser}
        role="user"
      />
    </div>
  );
};

export default ManageUsersPage;
