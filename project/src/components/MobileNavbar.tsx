import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Bell } from 'lucide-react';

const MobileNavbar: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="bg-gray-800 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
          <User className="w-6 h-6 text-white" />
        </div>
        <div>
          <div className="text-sm text-gray-300">+255 {user?.phone?.slice(-9) || '000000000'}</div>
          <div className="text-xs text-gray-400">Balance: {user?.balance?.toLocaleString() || 0}</div>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <Bell className="w-6 h-6 text-gray-400" />
        <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
          <span className="text-xs font-bold text-black">F</span>
        </div>
      </div>
    </div>
  );
};

export default MobileNavbar;