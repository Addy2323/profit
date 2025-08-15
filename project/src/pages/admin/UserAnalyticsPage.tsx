import React, { useState, useEffect } from 'react';
import { Search, Phone, DollarSign, ShoppingBag, TrendingUp, Users, Download, Filter, CheckCircle, XCircle, Clock } from 'lucide-react';
import { User, Transaction, Purchase, Product } from '../../types';

interface UserAnalytics {
  user: User;
  totalDeposits: number;
  totalWithdrawals: number;
  totalTransactions: number;
  purchasedProducts: Array<{
    product: Product;
    purchaseDate: Date;
    amount: number;
  }>;
  lastActivity: Date;
  netAmount: number;
}

const UserAnalyticsPage: React.FC = () => {
  const [userAnalytics, setUserAnalytics] = useState<UserAnalytics[]>([]);
  const [filteredAnalytics, setFilteredAnalytics] = useState<UserAnalytics[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'deposits' | 'transactions' | 'lastActivity'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterMinDeposit, setFilterMinDeposit] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserAnalytics();
  }, []);

  useEffect(() => {
    filterAndSortUsers();
  }, [userAnalytics, searchTerm, sortBy, sortOrder, filterMinDeposit]);

  const loadUserAnalytics = () => {
    setLoading(true);
    try {
      // Load users with fallback
      const usersData = localStorage.getItem('profitnet_users');
      const users: User[] = usersData ? JSON.parse(usersData) : [];
      
      // Load transactions with fallback
      const transactionsData = localStorage.getItem('profitnet_transactions');
      const transactions: Transaction[] = transactionsData ? JSON.parse(transactionsData) : [];
      
      // Load purchases with fallback
      const purchasesData = localStorage.getItem('profitnet_purchases');
      const purchases: Purchase[] = purchasesData ? JSON.parse(purchasesData) : [];
      
      // Load products with fallback
      const productsData = localStorage.getItem('profitnet_products');
      const products: Product[] = productsData ? JSON.parse(productsData) : [];

      // Load recharge data as additional transaction source
      const rechargesData = localStorage.getItem('profitnet_recharges');
      const recharges = rechargesData ? JSON.parse(rechargesData) : [];

      const analytics: UserAnalytics[] = users.map(user => {
        // Calculate user transactions from multiple sources
        const userTransactions = transactions.filter(t => t.userId === user.id);
        const userRecharges = recharges.filter((r: any) => r.userId === user.id);
        
        // Calculate deposits from transactions and recharges
        const transactionDeposits = userTransactions.filter(t => 
          (t.type === 'recharge' || t.type === 'deposit') && t.status === 'completed'
        );
        const completedRecharges = userRecharges.filter((r: any) => r.status === 'completed');
        
        const totalDeposits = [
          ...transactionDeposits.map(t => t.amount),
          ...completedRecharges.map((r: any) => r.amount || 0)
        ].reduce((sum, amount) => sum + amount, 0);
        
        // Calculate withdrawals
        const withdrawals = userTransactions.filter(t => t.type === 'withdraw' && t.status === 'completed');
        const totalWithdrawals = withdrawals.reduce((sum, t) => sum + t.amount, 0);
        
        // Get user purchases with product details
        const userPurchases = purchases.filter(p => p.userId === user.id);
        const purchasedProducts = userPurchases.map(purchase => {
          const product = products.find(p => p.id === purchase.productId) || purchase.product;
          return {
            product: product || { id: 'unknown', name: 'Unknown Product', price: 0 },
            purchaseDate: new Date(purchase.purchaseDate),
            amount: product?.price || 0
          };
        });

        // Find last activity from all sources
        const allUserActivities = [
          ...userTransactions.map(t => {
            try {
              return new Date(t.createdAt);
            } catch {
              return new Date();
            }
          }),
          ...userPurchases.map(p => {
            try {
              return new Date(p.purchaseDate);
            } catch {
              return new Date();
            }
          }),
          ...userRecharges.map((r: any) => {
            try {
              return new Date(r.createdAt || r.timestamp || Date.now());
            } catch {
              return new Date();
            }
          })
        ].filter(date => !isNaN(date.getTime()));
        
        const lastActivity = allUserActivities.length > 0 
          ? new Date(Math.max(...allUserActivities.map(d => d.getTime())))
          : new Date(user.createdAt || Date.now());

        return {
          user: {
            ...user,
            phone: user.phone || 'N/A',
            email: user.email || 'N/A',
            name: user.name || 'Unknown User',
            balance: user.balance || 0,
            isActive: user.isActive !== false, // Default to true if undefined
            createdAt: user.createdAt || new Date()
          },
          totalDeposits,
          totalWithdrawals,
          totalTransactions: userTransactions.length + userRecharges.length,
          purchasedProducts,
          lastActivity,
          netAmount: totalDeposits - totalWithdrawals
        };
      });

      setUserAnalytics(analytics);
      console.log(`Loaded analytics for ${analytics.length} users`);
    } catch (error) {
      console.error('Error loading user analytics:', error);
      // Set empty array on error to prevent crashes
      setUserAnalytics([]);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortUsers = () => {
    let filtered = [...userAnalytics];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(analytics =>
        analytics.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        analytics.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        analytics.user.phone.includes(searchTerm)
      );
    }

    // Minimum deposit filter
    if (filterMinDeposit > 0) {
      filtered = filtered.filter(analytics => analytics.totalDeposits >= filterMinDeposit);
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.user.name.toLowerCase();
          bValue = b.user.name.toLowerCase();
          break;
        case 'deposits':
          aValue = a.totalDeposits;
          bValue = b.totalDeposits;
          break;
        case 'transactions':
          aValue = a.totalTransactions;
          bValue = b.totalTransactions;
          break;
        case 'lastActivity':
          aValue = a.lastActivity.getTime();
          bValue = b.lastActivity.getTime();
          break;
        default:
          aValue = a.user.name.toLowerCase();
          bValue = b.user.name.toLowerCase();
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredAnalytics(filtered);
  };

  const exportToCSV = () => {
    if (filteredAnalytics.length === 0) {
      alert('No data to export');
      return;
    }

    const headers = [
      'User ID',
      'Name',
      'Email', 
      'Phone',
      'Network',
      'Total Deposits (TZS)',
      'Total Withdrawals (TZS)',
      'Net Amount (TZS)',
      'Current Balance (TZS)',
      'Total Transactions',
      'Products Purchased',
      'Last Activity Date',
      'Last Activity Time',
      'Account Status',
      'User Role',
      'Join Date'
    ];

    const csvData = filteredAnalytics.map(analytics => [
      analytics.user.id,
      analytics.user.name || 'Unknown',
      analytics.user.email || 'N/A',
      analytics.user.phone || 'N/A',
      analytics.user.network || 'N/A',
      analytics.totalDeposits.toFixed(2),
      analytics.totalWithdrawals.toFixed(2),
      analytics.netAmount.toFixed(2),
      analytics.user.balance.toFixed(2),
      analytics.totalTransactions,
      analytics.purchasedProducts.map(p => p.product?.name || 'Unknown').join('; ') || 'None',
      analytics.lastActivity.toLocaleDateString('en-GB'),
      analytics.lastActivity.toLocaleTimeString('en-GB'),
      analytics.user.isActive ? 'Active' : 'Inactive',
      analytics.user.role || 'user',
      new Date(analytics.user.createdAt).toLocaleDateString('en-GB')
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    try {
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `user_analytics_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      console.log(`Exported ${filteredAnalytics.length} user records to CSV`);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Error exporting data. Please try again.');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-TZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const totalStats = {
    totalUsers: userAnalytics.length,
    totalDeposits: userAnalytics.reduce((sum, a) => sum + a.totalDeposits, 0),
    totalWithdrawals: userAnalytics.reduce((sum, a) => sum + a.totalWithdrawals, 0),
    activeUsers: userAnalytics.filter(a => a.user.isActive).length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">User Analytics Dashboard</h1>
          <p className="text-gray-600">Complete overview of all users with transaction history and product purchases</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-6 flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
          >
            <option value="name">Sort by Name</option>
            <option value="deposits">Sort by Deposits</option>
            <option value="transactions">Sort by Transactions</option>
            <option value="lastActivity">Sort by Last Activity</option>
          </select>
          
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>

        {/* User Analytics Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Summary Stats Row */}
          <div className="bg-blue-50 px-6 py-4 border-b border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="font-semibold text-gray-900">{totalStats.totalUsers}</div>
                <div className="text-gray-600">Total Users</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-green-600">TZS {totalStats.totalDeposits.toLocaleString()}</div>
                <div className="text-gray-600">Total Deposits</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-red-600">TZS {totalStats.totalWithdrawals.toLocaleString()}</div>
                <div className="text-gray-600">Total Withdrawals</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-blue-600">{totalStats.activeUsers}</div>
                <div className="text-gray-600">Active Users</div>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    USER ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    NAME & PHONE
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    DEPOSITS
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    WITHDRAWALS
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    NET AMOUNT
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    PRODUCTS
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    LAST ACTIVITY
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    STATUS
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredAnalytics.map((analytics, index) => (
                  <tr key={analytics.user.id} className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono text-gray-900">
                        {analytics.user.id.slice(0, 8).toUpperCase()}
                      </div>
                      <div className="text-xs text-gray-500">
                        📞 {analytics.user.phone}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {analytics.user.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {analytics.user.email}
                      </div>
                      {analytics.user.network && (
                        <div className="text-xs text-blue-600 font-medium">
                          {analytics.user.network}
                        </div>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-green-600">
                        TZS {analytics.totalDeposits.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {analytics.totalTransactions} transactions
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-red-600">
                        TZS {analytics.totalWithdrawals.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        Balance: TZS {analytics.user.balance.toLocaleString()}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-semibold ${
                        analytics.netAmount >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        TZS {analytics.netAmount.toLocaleString()}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        {analytics.purchasedProducts.length > 0 ? (
                          <div className="space-y-1">
                            {analytics.purchasedProducts.slice(0, 2).map((purchase, idx) => (
                              <div key={idx} className="text-xs text-gray-700">
                                🛍️ {purchase.product?.name || 'Unknown'}
                              </div>
                            ))}
                            {analytics.purchasedProducts.length > 2 && (
                              <div className="text-xs text-gray-500">
                                +{analytics.purchasedProducts.length - 2} more
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">No purchases</span>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {analytics.lastActivity.toLocaleDateString('en-GB')}
                      </div>
                      <div className="text-xs text-gray-500">
                        {analytics.lastActivity.toLocaleTimeString('en-GB', { 
                          hour: '2-digit', 
                          minute: '2-digit',
                          hour12: true 
                        })}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {analytics.user.isActive ? (
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="ml-1 text-xs text-green-600 font-medium">Active</span>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <XCircle className="h-4 w-4 text-red-500" />
                            <span className="ml-1 text-xs text-red-600 font-medium">Inactive</span>
                          </div>
                        )}
                      </div>
                      {analytics.user.isBlocked && (
                        <div className="flex items-center mt-1">
                          <XCircle className="h-3 w-3 text-red-500" />
                          <span className="ml-1 text-xs text-red-600">Blocked</span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredAnalytics.length === 0 && (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search criteria.
              </p>
            </div>
          )}
        </div>
        
        {/* Results Summary */}
        {filteredAnalytics.length > 0 && (
          <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
            <span>Showing {filteredAnalytics.length} of {userAnalytics.length} users</span>
            <div className="flex gap-4">
              <span>Total Deposits: <strong className="text-green-600">TZS {totalStats.totalDeposits.toLocaleString()}</strong></span>
              <span>Total Withdrawals: <strong className="text-red-600">TZS {totalStats.totalWithdrawals.toLocaleString()}</strong></span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserAnalyticsPage;
