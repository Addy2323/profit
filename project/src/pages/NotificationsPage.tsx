import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';

const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      const notificationsKey = `notifications_${user.id}`;
      const storedNotifications = JSON.parse(localStorage.getItem(notificationsKey) || '[]');
      setNotifications(storedNotifications);

      // Mark all as read
      const updatedNotifications = storedNotifications.map((n: any) => ({ ...n, read: true }));
      localStorage.setItem(notificationsKey, JSON.stringify(updatedNotifications));
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 px-4 py-4 flex items-center sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="mr-4">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-lg font-semibold">Notifications</h1>
      </div>

      {/* Notifications List */}
      <div className="p-4">
        {notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div key={notification.id} className={`bg-gray-800 rounded-xl p-4 border-l-4 ${notification.read ? 'border-gray-700' : 'border-blue-500'}`}>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-semibold text-white">{notification.title}</h2>
                  <div className="text-xs text-gray-400">
                    {format(new Date(notification.createdAt), 'MMM d, yyyy')}
                  </div>
                </div>
                <p className="text-sm text-gray-300">{notification.message}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">No notifications</div>
            <div className="text-sm text-gray-500">You have no new notifications.</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
