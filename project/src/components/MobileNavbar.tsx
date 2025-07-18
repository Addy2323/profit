import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

const MobileNavbar: React.FC = () => {
  const { user } = useAuth();
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    if (user) {
      const checkUnread = () => {
        const notificationsKey = `notifications_${user.id}`;
        const storedNotifications = JSON.parse(localStorage.getItem(notificationsKey) || '[]');
        const unread = storedNotifications.some((n: any) => !n.read);
        setHasUnread(unread);
      };

      checkUnread();
      // Poll for new notifications periodically
      const interval = setInterval(checkUnread, 5000); // Check every 5 seconds
      return () => clearInterval(interval);
    }
  }, [user]);

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
        <Link to="/notifications" className="relative">
          <Bell className="w-6 h-6 text-gray-400" />
          {hasUnread && (
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
          )}
        </Link>
        <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
          <span className="text-xs font-bold text-black">F</span>
        </div>
      </div>
    </div>
  );
};

export default MobileNavbar;