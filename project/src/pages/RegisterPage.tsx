import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import { showErrorAlert, showSuccessAlert } from '../utils/alertUtils';

// Registration page – phone number, password + confirm password
const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    invitationCode: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const { name, mobile, password, confirmPassword, invitationCode } = formData;
    if (!name || !mobile || !password || !confirmPassword) {
      showErrorAlert('All fields are required. Please fill in your name, mobile number, password, and confirm password.');
      return;
    }

    if (password.length < 6) {
      showErrorAlert('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      showErrorAlert('Passwords do not match. Please check and try again.');
      return;
    }

    const email = `${mobile}@profitnet.tz`;
    const success = await register({ name, phone: mobile, email, password, referredBy: invitationCode });
    if (success) {
      showSuccessAlert('Registration successful! You can now log in with your credentials.');
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-pink-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white/10 backdrop-blur-md rounded-lg p-8 shadow-lg">
        <h2 className="text-center text-white text-xl font-semibold mb-6">Create Account</h2>

        {error && (
          <div className="bg-red-500/20 border border-red-400 text-red-200 rounded p-3 mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm text-white mb-1">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your Full Name"
              className="w-full bg-gray-900/80 focus:bg-gray-900 text-white rounded px-4 py-3 outline-none"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

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

          <div>
            <label htmlFor="confirmPassword" className="block text-sm text-white mb-1">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Enter your password"
              className="w-full bg-gray-900/80 focus:bg-gray-900 text-white rounded px-4 py-3 outline-none"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="invitationCode" className="block text-sm text-white mb-1">
              Invitation Code (optional)
            </label>
            <input
              id="invitationCode"
              name="invitationCode"
              type="text"
              placeholder="Enter invitation code"
              className="w-full bg-gray-900/80 focus:bg-gray-900 text-white rounded px-4 py-3 outline-none"
              value={formData.invitationCode}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-medium disabled:opacity-60"
          >
            {isLoading ? 'Processing…' : 'Register'}
          </button>
        </form>

        <p className="text-center text-sm text-white/80 mt-4">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-white underline"
          >
            Sign&nbsp;In
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;