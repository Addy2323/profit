import React, { useState, useEffect } from 'react';
import UserFormModal from '../../components/UserFormModal';

const ManageAdminsPage: React.FC = () => {
  const [admins, setAdmins] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<any | null>(null);

  useEffect(() => {
    const allUsers = JSON.parse(localStorage.getItem('profitnet_users') || '[]');
    setAdmins(allUsers.filter((u: any) => u.role === 'admin'));
  }, []);

  const handleAddAdmin = (formData: any) => {
    const allUsers = JSON.parse(localStorage.getItem('profitnet_users') || '[]');
    const newAdmin = {
      id: Date.now().toString(),
      ...formData,
      balance: 0, // Admins have no balance
      role: 'admin',
      isActive: true,
      createdAt: new Date(),
      referralCode: 'ADMIN',
    };
    const updatedUsers = [...allUsers, newAdmin];
    localStorage.setItem('profitnet_users', JSON.stringify(updatedUsers));
    setAdmins(updatedUsers.filter((u: any) => u.role === 'admin'));
    setIsModalOpen(false);
  };

  const handleEditAdmin = (formData: any) => {
    const allUsers = JSON.parse(localStorage.getItem('profitnet_users') || '[]');
    const updatedUsers = allUsers.map((u: any) => {
      if (u.id === editingAdmin.id) {
        const updatedAdmin = { ...u, ...formData };
        if (!formData.password) {
          updatedAdmin.password = u.password; // Keep original password if not changed
        }
        return updatedAdmin;
      }
      return u;
    });
    localStorage.setItem('profitnet_users', JSON.stringify(updatedUsers));
    setAdmins(updatedUsers.filter((u: any) => u.role === 'admin'));
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAdmin(null);
  };

  const handleDeleteAdmin = (adminId: string) => {
    if (window.confirm('Are you sure you want to delete this admin?')) {
      const allUsers = JSON.parse(localStorage.getItem('profitnet_users') || '[]');
      const updatedUsers = allUsers.filter((u: any) => u.id !== adminId);
      localStorage.setItem('profitnet_users', JSON.stringify(updatedUsers));
      setAdmins(updatedUsers.filter((u: any) => u.role === 'admin'));
      alert('Admin deleted successfully.');
    }
  };

  return (
    <div className="text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-red-500">Manage Admins</h1>
        <button 
          onClick={() => {
            setEditingAdmin(null);
            setIsModalOpen(true);
          }}
          className="bg-green-600 px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-all duration-300"
        >
          Add New Admin
        </button>
      </div>
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-600">
              <th className="p-3">ID</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map(admin => (
              <tr key={admin.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                <td className="p-3 text-sm">{admin.id}</td>
                <td className="p-3">{admin.email}</td>
                <td className="p-3">{admin.phone}</td>
                <td className="p-3">
                  <button 
                    onClick={() => {
                      setEditingAdmin(admin);
                      setIsModalOpen(true);
                    }}
                    className="text-blue-400 hover:text-blue-300 mr-3"
                  >
                    Edit
                  </button>
                  <button onClick={() => handleDeleteAdmin(admin.id)} className="text-red-500 hover:text-red-400">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <UserFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={editingAdmin ? handleEditAdmin : handleAddAdmin}
        initialData={editingAdmin}
        role="admin"
      />
    </div>
  );
};

export default ManageAdminsPage;
