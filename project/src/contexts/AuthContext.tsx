import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Partial<User> & { password: string }) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Function to generate a random referral code
const generateReferralCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Demo accounts for testing
const demoAccounts = [
  {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@profitnet.tz',
    password: 'admin123',
    phone: '+255765123456',
    network: 'vodacom',
    balance: 50000,
    role: 'admin' as const,
    referralCode: generateReferralCode(),
    isActive: true,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'user-1',
    name: 'John Doe',
    email: 'user@profitnet.tz',
    password: 'user123',
    phone: '+255754987654',
    network: 'tigo',
    balance: 25000,
    role: 'user' as const,
    referralCode: generateReferralCode(),
    isActive: true,
    createdAt: new Date('2024-01-15'),
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize demo accounts in localStorage if they don't exist
    const existingUsers = localStorage.getItem('profitnet_users');
    if (!existingUsers) {
      localStorage.setItem('profitnet_users', JSON.stringify(demoAccounts));
    }

    // Load user from localStorage on app start
    const storedUser = localStorage.getItem('profitnet_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('profitnet_user');
      }
    }
    setIsLoading(false);
  }, []);

  const generateReferralCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      const users = JSON.parse(localStorage.getItem('profitnet_users') || '[]');
      const foundUser = users.find((u: any) => u.email === email && u.password === password);
      
      if (foundUser) {
        // Remove password from user object before storing
        const { password: _, ...userWithoutPassword } = foundUser;
        const userToStore = userWithoutPassword as User;
        
        setUser(userToStore);
        localStorage.setItem('profitnet_user', JSON.stringify(userToStore));
        setIsLoading(false);
        return true;
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const register = async (userData: Partial<User> & { password: string }): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      const users = JSON.parse(localStorage.getItem('profitnet_users') || '[]');
      const existingUser = users.find((u: any) => u.email === userData.email);
      
      if (existingUser) {
        setIsLoading(false);
        return false;
      }
      
      const newUser: User = {
        id: Date.now().toString(),
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        network: userData.network || '',
        balance: 0,
        role: 'user',
        referralCode: generateReferralCode(),
        referredBy: userData.referredBy,
        isActive: true,
        createdAt: new Date(),
      };
      
      // Store user with password for authentication
      const userWithPassword = { ...newUser, password: userData.password };
      users.push(userWithPassword);
      localStorage.setItem('profitnet_users', JSON.stringify(users));
      
      // Store user without password in current session
      setUser(newUser);
      localStorage.setItem('profitnet_user', JSON.stringify(newUser));
      
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('profitnet_user');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('profitnet_user', JSON.stringify(updatedUser));
      
      // Update in users list
      try {
        const users = JSON.parse(localStorage.getItem('profitnet_users') || '[]');
        const userIndex = users.findIndex((u: any) => u.id === user.id);
        if (userIndex !== -1) {
          users[userIndex] = { ...users[userIndex], ...userData };
          localStorage.setItem('profitnet_users', JSON.stringify(users));
        }
      } catch (error) {
        console.error('Error updating user in storage:', error);
      }
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};