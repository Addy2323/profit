import React, { useState, useEffect } from 'react';

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => void;
  initialData?: any;
  role: 'user' | 'admin';
}

const UserFormModal: React.FC<UserFormModalProps> = ({ isOpen, onClose, onSubmit, initialData, role }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    balance: 0,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData, password: '' }); // Clear password on edit
    } else {
      setFormData({ name: '', email: '', phone: '', password: '', balance: 0 });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md border border-red-500/30">
        <h2 className="text-2xl font-bold text-white mb-4">{initialData ? 'Edit' : 'Add'} {role === 'user' ? 'User' : 'Admin'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="w-full p-2 rounded bg-gray-700 text-white" required />
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full p-2 rounded bg-gray-700 text-white" required />
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className="w-full p-2 rounded bg-gray-700 text-white" required />
          <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder={initialData ? 'New Password (optional)' : 'Password'} className="w-full p-2 rounded bg-gray-700 text-white" required={!initialData} />
          {role === 'user' && (
            <input type="number" name="balance" value={formData.balance} onChange={handleChange} placeholder="Balance" className="w-full p-2 rounded bg-gray-700 text-white" />
          )}
          <div className="flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded bg-red-600 hover:bg-red-700">{initialData ? 'Save Changes' : 'Create'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;
