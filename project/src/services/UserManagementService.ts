import { UserActivity, UserStatus, FraudAlert, WithdrawalRequest } from '../types/UserManagement';

export class UserManagementService {
  private static readonly USER_ACTIVITIES_KEY = 'profitnet_user_activities';
  private static readonly FRAUD_ALERTS_KEY = 'profitnet_fraud_alerts';
  private static readonly WITHDRAWAL_REQUESTS_KEY = 'profitnet_withdrawal_requests';

  // User Activity Tracking
  static logUserActivity(userId: string, action: string, details: string, ipAddress?: string): void {
    const activities = this.getUserActivities();
    const newActivity: UserActivity = {
      id: Date.now().toString(),
      userId,
      action,
      details,
      timestamp: new Date(),
      ipAddress,
      userAgent: navigator.userAgent
    };
    
    activities.push(newActivity);
    localStorage.setItem(this.USER_ACTIVITIES_KEY, JSON.stringify(activities));
  }

  static getUserActivities(userId?: string): UserActivity[] {
    const activities = localStorage.getItem(this.USER_ACTIVITIES_KEY);
    const allActivities: UserActivity[] = activities ? JSON.parse(activities) : [];
    
    if (userId) {
      return allActivities.filter(activity => activity.userId === userId);
    }
    
    return allActivities;
  }

  // User Status Management
  static updateUserStatus(userId: string, status: Partial<UserStatus>, adminId: string): boolean {
    try {
      const users = JSON.parse(localStorage.getItem('profitnet_users') || '[]');
      const userIndex = users.findIndex((u: any) => u.id === userId);
      
      if (userIndex === -1) return false;
      
      const user = users[userIndex];
      const updatedStatus = { ...user.status, ...status };
      
      if (status.isBanned) {
        updatedStatus.bannedAt = new Date();
        updatedStatus.bannedBy = adminId;
        this.logUserActivity(userId, 'USER_BANNED', `User banned by admin: ${status.banReason || 'No reason provided'}`);
      } else if (user.status?.isBanned && !status.isBanned) {
        updatedStatus.bannedAt = undefined;
        updatedStatus.bannedBy = undefined;
        updatedStatus.banReason = undefined;
        this.logUserActivity(userId, 'USER_UNBANNED', `User unbanned by admin`);
      }
      
      users[userIndex] = { ...user, status: updatedStatus };
      localStorage.setItem('profitnet_users', JSON.stringify(users));
      
      return true;
    } catch (error) {
      console.error('Error updating user status:', error);
      return false;
    }
  }

  static getUserStatus(userId: string): UserStatus | null {
    try {
      const users = JSON.parse(localStorage.getItem('profitnet_users') || '[]');
      const user = users.find((u: any) => u.id === userId);
      
      return user?.status || { isActive: true, isBanned: false };
    } catch (error) {
      return null;
    }
  }

  // Fraud Detection and Alerts
  static createFraudAlert(userId: string, type: FraudAlert['type'], severity: FraudAlert['severity'], description: string): FraudAlert {
    const alerts = this.getFraudAlerts();
    const newAlert: FraudAlert = {
      id: Date.now().toString(),
      userId,
      type,
      severity,
      description,
      detectedAt: new Date(),
      status: 'pending'
    };
    
    alerts.push(newAlert);
    localStorage.setItem(this.FRAUD_ALERTS_KEY, JSON.stringify(alerts));
    
    this.logUserActivity(userId, 'FRAUD_ALERT_CREATED', `${severity.toUpperCase()} alert: ${description}`);
    
    return newAlert;
  }

  static getFraudAlerts(status?: FraudAlert['status']): FraudAlert[] {
    const alerts = localStorage.getItem(this.FRAUD_ALERTS_KEY);
    const allAlerts: FraudAlert[] = alerts ? JSON.parse(alerts) : [];
    
    if (status) {
      return allAlerts.filter(alert => alert.status === status);
    }
    
    return allAlerts.sort((a, b) => new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime());
  }

  static updateFraudAlert(alertId: string, updates: Partial<FraudAlert>): boolean {
    try {
      const alerts = this.getFraudAlerts();
      const alertIndex = alerts.findIndex(alert => alert.id === alertId);
      
      if (alertIndex === -1) return false;
      
      alerts[alertIndex] = { ...alerts[alertIndex], ...updates };
      localStorage.setItem(this.FRAUD_ALERTS_KEY, JSON.stringify(alerts));
      
      return true;
    } catch (error) {
      return false;
    }
  }

  // Fraud Detection Logic
  static detectDepositAnomalies(userId: string, amount: number): void {
    const userActivities = this.getUserActivities(userId);
    const recentDeposits = userActivities
      .filter(activity => activity.action === 'DEPOSIT' && 
              new Date(activity.timestamp).getTime() > Date.now() - 24 * 60 * 60 * 1000)
      .map(activity => parseFloat(activity.details.match(/(\d+)/)?.[0] || '0'));
    
    // Check for unusually large deposits
    if (amount > 1000000) {
      this.createFraudAlert(userId, 'deposit_anomaly', 'high', 
        `Large deposit detected: ${amount.toLocaleString()} TZS`);
    }
    
    // Check for multiple deposits in short time
    if (recentDeposits.length > 5) {
      this.createFraudAlert(userId, 'suspicious_pattern', 'medium', 
        `${recentDeposits.length} deposits in 24 hours`);
    }
    
    // Check for rapid increase in deposit amounts
    const avgDeposit = recentDeposits.reduce((a, b) => a + b, 0) / recentDeposits.length;
    if (amount > avgDeposit * 5) {
      this.createFraudAlert(userId, 'deposit_anomaly', 'medium', 
        `Deposit amount ${amount.toLocaleString()} TZS significantly higher than average`);
    }
  }

  static detectWithdrawalAnomalies(userId: string, amount: number): void {
    const userActivities = this.getUserActivities(userId);
    const recentWithdrawals = userActivities
      .filter(activity => activity.action === 'WITHDRAWAL_REQUEST' && 
              new Date(activity.timestamp).getTime() > Date.now() - 24 * 60 * 60 * 1000);
    
    // Check for multiple withdrawal attempts
    if (recentWithdrawals.length > 3) {
      this.createFraudAlert(userId, 'withdrawal_anomaly', 'high', 
        `${recentWithdrawals.length} withdrawal attempts in 24 hours`);
    }
    
    // Check for large withdrawal amounts
    if (amount > 500000) {
      this.createFraudAlert(userId, 'withdrawal_anomaly', 'medium', 
        `Large withdrawal request: ${amount.toLocaleString()} TZS`);
    }
  }

  // Withdrawal Queue Management
  static getWithdrawalRequests(status?: WithdrawalRequest['status']): WithdrawalRequest[] {
    const requests = localStorage.getItem(this.WITHDRAWAL_REQUESTS_KEY);
    const allRequests: WithdrawalRequest[] = requests ? JSON.parse(requests) : [];
    
    if (status) {
      return allRequests.filter(request => request.status === status);
    }
    
    return allRequests.sort((a, b) => new Date(a.requestedAt).getTime() - new Date(b.requestedAt).getTime());
  }

  static createWithdrawalRequest(userId: string, amount: number): WithdrawalRequest {
    const requests = this.getWithdrawalRequests();
    const newRequest: WithdrawalRequest = {
      id: Date.now().toString(),
      userId,
      amount,
      requestedAt: new Date(),
      status: 'pending'
    };
    
    requests.push(newRequest);
    localStorage.setItem(this.WITHDRAWAL_REQUESTS_KEY, JSON.stringify(requests));
    
    this.logUserActivity(userId, 'WITHDRAWAL_REQUEST', `Withdrawal request: ${amount.toLocaleString()} TZS`);
    this.detectWithdrawalAnomalies(userId, amount);
    
    return newRequest;
  }

  static updateWithdrawalRequest(requestId: string, updates: Partial<WithdrawalRequest>, adminId?: string): boolean {
    try {
      const requests = this.getWithdrawalRequests();
      const requestIndex = requests.findIndex(request => request.id === requestId);
      
      if (requestIndex === -1) return false;
      
      const updatedRequest = {
        ...requests[requestIndex],
        ...updates,
        reviewedBy: adminId,
        reviewedAt: new Date()
      };
      
      requests[requestIndex] = updatedRequest;
      localStorage.setItem(this.WITHDRAWAL_REQUESTS_KEY, JSON.stringify(requests));
      
      this.logUserActivity(updatedRequest.userId, 'WITHDRAWAL_REVIEWED', 
        `Withdrawal ${updates.status} by admin: ${updates.rejectionReason || 'Approved'}`);
      
      return true;
    } catch (error) {
      return false;
    }
  }

  // Analytics and Reporting
  static getUserStats(userId?: string) {
    const activities = this.getUserActivities(userId);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayActivities = activities.filter(activity => 
      new Date(activity.timestamp).getTime() >= today.getTime());
    
    const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const weekActivities = activities.filter(activity => 
      new Date(activity.timestamp).getTime() >= thisWeek.getTime());
    
    return {
      totalActivities: activities.length,
      todayActivities: todayActivities.length,
      weekActivities: weekActivities.length,
      lastActivity: activities.length > 0 ? activities[activities.length - 1].timestamp : null
    };
  }

  static getSystemStats() {
    const users = JSON.parse(localStorage.getItem('profitnet_users') || '[]');
    const activities = this.getUserActivities();
    const fraudAlerts = this.getFraudAlerts();
    const withdrawalRequests = this.getWithdrawalRequests();
    
    return {
      totalUsers: users.length,
      activeUsers: users.filter((u: any) => u.status?.isActive !== false).length,
      bannedUsers: users.filter((u: any) => u.status?.isBanned === true).length,
      totalActivities: activities.length,
      pendingFraudAlerts: fraudAlerts.filter(alert => alert.status === 'pending').length,
      pendingWithdrawals: withdrawalRequests.filter(req => req.status === 'pending').length
    };
  }

  // Initialize sample data for testing
  static initializeSampleData() {
    // Add sample withdrawal requests if none exist
    const existingRequests = this.getWithdrawalRequests();
    if (existingRequests.length === 0) {
      const sampleRequests: WithdrawalRequest[] = [
        {
          id: 'wr_001',
          userId: 'user_001',
          amount: 500,
          method: 'Bank Transfer',
          status: 'pending',
          requestedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
          details: { bankAccount: '1234567890', bankName: 'Chase Bank' }
        },
        {
          id: 'wr_002',
          userId: 'user_002',
          amount: 250,
          method: 'PayPal',
          status: 'pending',
          requestedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          details: { paypalEmail: 'user@example.com' }
        },
        {
          id: 'wr_003',
          userId: 'user_003',
          amount: 1000,
          method: 'Crypto',
          status: 'approved',
          requestedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
          processedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          processedBy: 'admin',
          details: { walletAddress: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa' }
        }
      ];
      localStorage.setItem(this.WITHDRAWAL_REQUESTS_KEY, JSON.stringify(sampleRequests));
    }

    // Add sample fraud alerts if none exist
    const existingAlerts = this.getFraudAlerts();
    if (existingAlerts.length === 0) {
      const sampleAlerts: FraudAlert[] = [
        {
          id: 'fa_001',
          userId: 'user_001',
          type: 'withdrawal_anomaly',
          severity: 'high',
          description: 'User attempted to withdraw $5000, which is 10x their average withdrawal amount',
          status: 'pending',
          detectedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() // 1 hour ago
        },
        {
          id: 'fa_002',
          userId: 'user_002',
          type: 'deposit_anomaly',
          severity: 'medium',
          description: 'Unusual deposit pattern detected: 5 deposits within 10 minutes',
          status: 'investigating',
          detectedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
          investigatedBy: 'admin'
        },
        {
          id: 'fa_003',
          userId: 'user_003',
          type: 'suspicious_pattern',
          severity: 'critical',
          description: 'Account shows signs of potential money laundering: rapid deposits followed by immediate withdrawals',
          status: 'resolved',
          detectedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          investigatedBy: 'admin',
          resolution: 'Verified legitimate business transactions with user documentation'
        }
      ];
      localStorage.setItem(this.FRAUD_ALERTS_KEY, JSON.stringify(sampleAlerts));
    }
  }
}
