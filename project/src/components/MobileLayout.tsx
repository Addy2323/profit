import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import MobileNavbar from './MobileNavbar';
import BottomNavigation from './BottomNavigation';

const MobileLayout: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  
  const hideBottomNav = ['/login', '/register'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {user && <MobileNavbar />}
      <main className={`${user && !hideBottomNav ? 'pb-20' : ''}`}>
        <Outlet />
      </main>
      {user && !hideBottomNav && <BottomNavigation />}
    </div>
  );
};

export default MobileLayout;