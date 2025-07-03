import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Smartphone } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    mobile: '',
    captcha: '',
    otp: '',
    password: '',
    confirmPassword: '',
    referralCode: '9986'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(false);
  const { login, register, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      // Login with demo accounts
      const success = await login('admin@profitnet.tz', 'admin123');
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Login failed');
      }
    } else {
      // Register new user
      if (!formData.mobile || !formData.password) {
        setError('Please fill in all required fields');
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      const userData = {
        name: 'New User',
        email: `${formData.mobile}@profitnet.tz`,
        phone: formData.mobile,
        password: formData.password,
        referredBy: formData.referralCode
      };

      const success = await register(userData);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Registration failed');
      }
    }
  };

  const handleDemoLogin = async () => {
    const success = await login('admin@profitnet.tz', 'admin123');
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-pink-900 relative overflow-hidden">
      {/* Magical Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute top-60 left-1/3 w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-40 right-10 w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
      </div>

      {/* Top Right Badge */}
      <div className="absolute top-4 right-4 w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
        <span className="text-black font-bold text-sm">F</span>
      </div>
      <div className="absolute top-4 right-16 text-white text-sm">24:49</div>

      {/* Zodiac Symbol */}
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2">
        <div className="w-20 h-20 border-4 border-blue-400 rounded-full flex items-center justify-center">
          <div className="text-2xl">♊</div>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {error && (
            <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-4 flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-400">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg">
              <span className="px-4 py-3 text-white border-r border-white/20">+255</span>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleInputChange}
                placeholder="Enter your mobile"
                className="flex-1 bg-transparent text-white placeholder-white/60 px-4 py-3 focus:outline-none"
              />
            </div>

            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg">
              <div className="px-4 py-3 border-r border-white/20">
                <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center">
                  <span className="text-xs">🛡️</span>
                </div>
              </div>
              <input
                type="text"
                name="captcha"
                value={formData.captcha}
                onChange={handleInputChange}
                placeholder="Graphic verification code"
                className="flex-1 bg-transparent text-white placeholder-white/60 px-4 py-3 focus:outline-none"
              />
              <div className="px-4 py-3 border-l border-white/20">
                <span className="text-white font-mono">9148</span>
              </div>
            </div>

            <div className="flex space-x-2">
              <div className="flex-1 flex items-center bg-white/10 backdrop-blur-sm rounded-lg border-2 border-red-500">
                <div className="px-4 py-3 border-r border-white/20">
                  <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center">
                    <span className="text-xs">🛡️</span>
                  </div>
                </div>
                <input
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleInputChange}
                  placeholder="OTP"
                  className="flex-1 bg-transparent text-white placeholder-white/60 px-4 py-3 focus:outline-none"
                />
              </div>
              <button
                type="button"
                className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-lg text-white font-medium"
              >
                OTP
              </button>
            </div>

            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Lock className="w-5 h-5 text-white/60" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter the login password"
                className="w-full bg-white/10 backdrop-blur-sm text-white placeholder-white/60 pl-10 pr-10 py-3 rounded-lg focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-white/60" />
                ) : (
                  <Eye className="w-5 h-5 text-white/60" />
                )}
              </button>
            </div>

            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Lock className="w-5 h-5 text-white/60" />
              </div>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Enter the login password again"
                className="w-full bg-white/10 backdrop-blur-sm text-white placeholder-white/60 pl-10 pr-4 py-3 rounded-lg focus:outline-none"
              />
            </div>

            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <div className="w-5 h-5 bg-white/20 rounded flex items-center justify-center">
                  <span className="text-xs">👥</span>
                </div>
              </div>
              <input
                type="text"
                name="referralCode"
                value={formData.referralCode}
                onChange={handleInputChange}
                className="w-full bg-white/10 backdrop-blur-sm text-white placeholder-white/60 pl-10 pr-4 py-3 rounded-lg focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-lg font-semibold text-lg hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : 'Register'}
            </button>

            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full border-2 border-white/30 text-white py-4 rounded-lg font-semibold hover:bg-white/10 transition-all"
            >
              Demo Login (Admin)
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-white/80 hover:text-white transition-colors"
              >
                {isLogin ? 'Need an account? Register' : 'Existing account member'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;