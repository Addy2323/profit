import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { showErrorAlert } from '../utils/alertUtils';

const AdminLoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      showErrorAlert('Please enter both email and password.');
      return;
    }
    
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    
    if (success) {
      navigate('/admin');
    }
    // Error handling is now done in AuthContext with alerts
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-900 via-blue-900 to-pink-900 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-black/30 backdrop-blur rounded-lg p-6 space-y-4"
      >
        <h1 className="text-xl font-semibold text-center text-white mb-2">Admin Login</h1>
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        <div>
          <label className="block text-sm text-gray-300 mb-1">Email</label>
          <input
            type="email"
            className="w-full px-3 py-2 rounded bg-gray-800 text-white focus:outline-none"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">Password</label>
          <input
            type="password"
            className="w-full px-3 py-2 rounded bg-gray-800 text-white focus:outline-none"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default AdminLoginPage;
