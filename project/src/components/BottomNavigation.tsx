import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Package, Users, User } from 'lucide-react';

const BottomNavigation: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/products', icon: Home, label: 'Home' },
    { path: '/projects', icon: Package, label: 'Projects' },
    { path: '/team', icon: Users, label: 'Team' },
    { path: '/dashboard', icon: User, label: 'MY' },
  ];

  // Helper function to check if path matches current location
  const checkActivePath = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700">
      <div className="flex items-center justify-around py-2">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = checkActivePath(path);
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center py-2 px-4 ${
                isActive ? 'text-yellow-400' : 'text-gray-400'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-sm">{label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;