import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import AdminDashboard from './admin/Dashboard';
import UserDashboard from './DashboardPage';

const UnifiedDashboard: React.FC = () => {
  const { user } = useAuth();

  // Render appropriate dashboard based on user role
  if (user?.role === 'admin' || user?.role === 'superadmin') {
    return <AdminDashboard />;
  }

  // Default to user dashboard
  return <UserDashboard />;
};

export default UnifiedDashboard;
