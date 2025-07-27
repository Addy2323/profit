import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';
import { NotificationService, Notification } from '../services/NotificationService';

const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (user) {
      const userNotifications = NotificationService.getUserNotifications(user.id);
      setNotifications(userNotifications);

      // Mark all as read when page is viewed
      NotificationService.markAllAsRead(user.id);
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
            {notifications.map((notification) => {
              const getBorderColor = () => {
                if (notification.type === 'success') return 'border-green-500';
                if (notification.type === 'error') return 'border-red-500';
                return 'border-blue-500';
              };
              
              const getIconColor = () => {
                if (notification.type === 'success') return 'text-green-400';
                if (notification.type === 'error') return 'text-red-400';
                return 'text-blue-400';
              };
              
              return (
                <div key={notification.id} className={`bg-gray-800 rounded-xl p-4 border-l-4 ${getBorderColor()}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className={`font-semibold ${getIconColor()}`}>{notification.title}</h2>
                    <div className="text-xs text-gray-400">
                      {format(new Date(notification.createdAt), 'MMM d, yyyy h:mm a')}
                    </div>
                  </div>
                  <p className="text-sm text-gray-300">{notification.message}</p>
                </div>
              );
            })}
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
