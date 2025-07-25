import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

// Minimal login page: phone number + password only
const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();

  const [formData, setFormData] = useState({ mobile: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.mobile || !formData.password) {
      setError('Both fields are required');
      return;
    }


    const success = await login(formData.mobile, formData.password);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-pink-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white/10 backdrop-blur-md rounded-lg p-8 shadow-lg">
        <h2 className="text-center text-white text-xl font-semibold mb-6">WELCOME BACK!!!</h2>
        <p className="text-center text-white text-sm mb-4">Login to your account</p>
        {error && (
          <div className="bg-red-500/20 border border-red-400 text-red-200 rounded p-3 mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="mobile" className="block text-sm text-white mb-1">
              Phone Number
            </label>
            <input
              id="mobile"
              name="mobile"
              type="tel"
              placeholder="e.g. +255712345678"
              className="w-full bg-gray-900/80 focus:bg-gray-900 text-white rounded px-4 py-3 outline-none"
              value={formData.mobile}
              onChange={handleChange}
            />
          </div>

          <div className="relative">
            <label htmlFor="password" className="block text-sm text-white mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              className="w-full bg-gray-900/80 focus:bg-gray-900 text-white rounded px-4 py-3 outline-none pr-10"
              value={formData.password}
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              className="absolute right-3 top-9 transform -translate-y-1/2 text-white/70"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-medium disabled:opacity-60"
          >
            {isLoading ? 'Processing…' : 'Login'}
          </button>

          <p className="text-center text-sm text-white/80 mt-4">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="text-white underline"
          >
            Sign&nbsp;Up
          </button>
        </p>

        </form>
      </div>
    </div>
  );
};

export default LoginPage;
