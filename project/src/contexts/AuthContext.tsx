import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { showSuccessAlert, showErrorAlert } from '../utils/alertUtils';
import { User } from '../types';
import { UserManagementService } from '../services/UserManagementService';

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
    id: 'super-admin-1',
    name: 'Super Admin',
    email: 'super@profitnet.tz',
    password: 'super123',
    phone: '+255712345678',
    network: 'airtel',
    balance: 1000000,
    role: 'superadmin' as const,
    referralCode: 'SUPER',
    isActive: true,
    createdAt: new Date('2024-01-01'),
  },
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

  // Function to process daily returns for purchased products
  const processDailyReturns = (u: User): User => {
    const purchasesKey = `purchases_${u.id}`;
    const txKey = `transactions_${u.id}`;
    let purchases: any[] = JSON.parse(localStorage.getItem(purchasesKey) || '[]');
    if (!purchases.length) return u;
    let totalReturn = 0;
    const now = Date.now();
    purchases = purchases.map(p => {
      const purchaseDate = new Date(p.purchaseDate).getTime();
      const daysHeld = Math.floor((now - purchaseDate) / (1000 * 60 * 60 * 24));
      const maxDays = p.product.cycleDays || 0;
      const eligibleDays = Math.min(daysHeld, maxDays);
      const returnsDue = Math.max(0, eligibleDays - (p.returnsPaid || 0));
      if (returnsDue > 0) {
        // determine daily return amount
        const base = p.product.price > 0 ? p.product.price : (p.product.originalPrice || 0);
        const dailyReturn = base / (p.product.cycleDays || 1);
        const amount = dailyReturn * returnsDue;
        totalReturn += amount;
        p.returnsPaid = (p.returnsPaid || 0) + returnsDue;
      }
      // deactivate if cycle completed
      if ((p.returnsPaid || 0) >= maxDays) {
        p.isActive = false;
      }
      return p;
    });
    if (totalReturn > 0) {
      // Update purchases storage
      localStorage.setItem(purchasesKey, JSON.stringify(purchases));
      // Update user balance
      u = { ...u, balance: (u.balance || 0) + totalReturn };
      // Save to users list
      try {
        const users = JSON.parse(localStorage.getItem('profitnet_users') || '[]');
        const idx = users.findIndex((us: any) => us.id === u.id);
        if (idx !== -1) {
          users[idx].balance = u.balance;
          localStorage.setItem('profitnet_users', JSON.stringify(users));
        }
      } catch(_){}
      // Add transaction record
      const tx = {
        id: Date.now().toString(),
        userId: u.id,
        type: 'return' as const,
        amount: totalReturn,
        description: 'Daily project returns',
        status: 'completed' as const,
        createdAt: new Date(),
      };
      const existingTx = JSON.parse(localStorage.getItem(txKey) || '[]');
      existingTx.unshift(tx);
      localStorage.setItem(txKey, JSON.stringify(existingTx));
    }
    return u;
  };

  useEffect(() => {
    const initializeAuth = () => {
    // Initialize with demo accounts only if no users exist
    const existingUsers = localStorage.getItem('profitnet_users');
    if (!existingUsers) {
      localStorage.setItem('profitnet_users', JSON.stringify(demoAccounts));
    } else {
      // Ensure demo accounts exist in the user list (in case they were deleted)
      try {
        const users = JSON.parse(existingUsers);
        let updated = false;
        
        // Check if each demo account exists, if not add it
        demoAccounts.forEach(demoAccount => {
          const exists = users.find((u: any) => u.id === demoAccount.id);
          if (!exists) {
            users.push(demoAccount);
            updated = true;
          }
        });
        
        if (updated) {
          localStorage.setItem('profitnet_users', JSON.stringify(users));
        }
      } catch (error) {
        console.error('Error parsing existing users:', error);
        localStorage.setItem('profitnet_users', JSON.stringify(demoAccounts));
      }
    }

    // Initialize sample data for admin dashboard features
    UserManagementService.initializeSampleData();

    // Load user from localStorage on app start
    const storedUser = localStorage.getItem('profitnet_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        const updated = processDailyReturns(parsedUser);
        setUser(updated);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('profitnet_user');
      }
    }
    setIsLoading(false);
  };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay

    try {
      const users = JSON.parse(localStorage.getItem('profitnet_users') || '[]');
      const foundUser = users.find((u: any) => (u.email === email || u.phone === email) && u.password === password);

      if (!foundUser) {
        setIsLoading(false);
        showErrorAlert('Invalid email/phone or password. Please check your credentials.');
        return false; // User not found
      }

      // Role verification based on the login page
      const path = window.location.pathname;
      if (path.includes('/super-admin-login')) {
        if (foundUser.role !== 'superadmin') {
          setIsLoading(false);
          showErrorAlert('You must be a super admin to access this page.');
          return false; // Must be superadmin
        }
      } else if (path.includes('/admin-login')) {
        if (foundUser.role !== 'admin') {
          setIsLoading(false);
          showErrorAlert('You must be an admin to access this page.');
          return false; // Must be admin
        }
      } else {
        // This is a regular user login
        if (foundUser.role !== 'user') {
          setIsLoading(false);
          showErrorAlert('Please use the correct login page for your account type.');
          return false; // Must be a user
        }
      }

      // Successful login
      const { password: _, ...userToStore } = foundUser;
      setUser(userToStore as User);
      localStorage.setItem('profitnet_user', JSON.stringify(userToStore));
      setIsLoading(false);
      showSuccessAlert(`Welcome back, ${userToStore.name}!`);
      return true;

    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      showErrorAlert('An unexpected error occurred during login. Please try again.');
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
        showErrorAlert('An account with this email already exists. Please use a different email or try logging in.');
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
      showSuccessAlert(`Welcome to ProfitNet, ${newUser.name}! Your account has been created successfully.`);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      setIsLoading(false);
      showErrorAlert('An unexpected error occurred during registration. Please try again.');
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