import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { showErrorAlert } from '../../utils/alertUtils';

const SuperAdminLoginPage: React.FC = () => {
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
      navigate('/super-admin');
    }
    // Error handling is now done in AuthContext with alerts
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-red-900 to-black p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-black/40 backdrop-blur-lg rounded-xl p-6 space-y-4 border border-red-500/30"
      >
        <h1 className="text-2xl font-bold text-center text-white mb-2">Super Admin Login</h1>
        {error && <p className="text-red-400 text-sm text-center bg-red-900/50 py-2 rounded-md">{error}</p>}
        <div>
          <label className="block text-sm text-gray-300 mb-1">Email</label>
          <input
            type="email"
            className="w-full px-3 py-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">Password</label>
          <input
            type="password"
            className="w-full px-3 py-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded bg-gradient-to-r from-red-600 to-red-800 text-white font-semibold disabled:opacity-50 hover:from-red-500 hover:to-red-700 transition-all duration-300"
        >
          {loading ? 'Authenticating...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default SuperAdminLoginPage;
