export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  read: boolean;
  createdAt: string;
  relatedTransactionId?: string;
  relatedWithdrawalId?: string;
}

export class NotificationService {
  private static readonly STORAGE_KEY_PREFIX = 'notifications_';

  /**
   * Create a new notification for a user
   */
  static createNotification(
    userId: string,
    title: string,
    message: string,
    type: 'success' | 'error' | 'info' | 'warning' = 'info',
    relatedTransactionId?: string,
    relatedWithdrawalId?: string
  ): Notification {
    const notification: Notification = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      userId,
      title,
      message,
      type,
      read: false,
      createdAt: new Date().toISOString(),
      relatedTransactionId,
      relatedWithdrawalId
    };

    // Get existing notifications
    const existingNotifications = this.getUserNotifications(userId);
    
    // Add new notification at the beginning
    existingNotifications.unshift(notification);
    
    // Keep only the last 50 notifications to prevent storage bloat
    const limitedNotifications = existingNotifications.slice(0, 50);
    
    // Save to localStorage
    localStorage.setItem(
      this.STORAGE_KEY_PREFIX + userId,
      JSON.stringify(limitedNotifications)
    );

    return notification;
  }

  /**
   * Get all notifications for a user
   */
  static getUserNotifications(userId: string): Notification[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY_PREFIX + userId);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading notifications:', error);
      return [];
    }
  }

  /**
   * Get unread notification count for a user
   */
  static getUnreadCount(userId: string): number {
    const notifications = this.getUserNotifications(userId);
    return notifications.filter(n => !n.read).length;
  }

  /**
   * Mark all notifications as read for a user
   */
  static markAllAsRead(userId: string): void {
    const notifications = this.getUserNotifications(userId);
    const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
    
    localStorage.setItem(
      this.STORAGE_KEY_PREFIX + userId,
      JSON.stringify(updatedNotifications)
    );
  }

  /**
   * Mark a specific notification as read
   */
  static markAsRead(userId: string, notificationId: string): void {
    const notifications = this.getUserNotifications(userId);
    const updatedNotifications = notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    );
    
    localStorage.setItem(
      this.STORAGE_KEY_PREFIX + userId,
      JSON.stringify(updatedNotifications)
    );
  }

  /**
   * Delete a notification
   */
  static deleteNotification(userId: string, notificationId: string): void {
    const notifications = this.getUserNotifications(userId);
    const updatedNotifications = notifications.filter(n => n.id !== notificationId);
    
    localStorage.setItem(
      this.STORAGE_KEY_PREFIX + userId,
      JSON.stringify(updatedNotifications)
    );
  }

  /**
   * Clear all notifications for a user
   */
  static clearAllNotifications(userId: string): void {
    localStorage.removeItem(this.STORAGE_KEY_PREFIX + userId);
  }

  // Predefined notification templates for common scenarios
  
  /**
   * Create deposit confirmation notification
   */
  static createDepositConfirmationNotification(
    userId: string,
    amount: number,
    transactionId: string
  ): Notification {
    return this.createNotification(
      userId,
      '✅ Deposit Confirmed',
      `Your deposit of TZS ${amount.toLocaleString()} has been confirmed and added to your balance.`,
      'success',
      transactionId
    );
  }

  /**
   * Create deposit rejection notification
   */
  static createDepositRejectionNotification(
    userId: string,
    amount: number,
    reason: string,
    transactionId: string
  ): Notification {
    return this.createNotification(
      userId,
      '❌ Deposit Rejected',
      `Your deposit request of TZS ${amount.toLocaleString()} has been rejected. Reason: ${reason}`,
      'error',
      transactionId
    );
  }

  /**
   * Create withdrawal approval notification
   */
  static createWithdrawalApprovalNotification(
    userId: string,
    amount: number,
    withdrawalId: string
  ): Notification {
    return this.createNotification(
      userId,
      '✅ Withdrawal Approved',
      `Your withdrawal request of TZS ${amount.toLocaleString()} has been approved and is being processed.`,
      'success',
      undefined,
      withdrawalId
    );
  }

  /**
   * Create withdrawal rejection notification
   */
  static createWithdrawalRejectionNotification(
    userId: string,
    amount: number,
    reason: string,
    withdrawalId: string
  ): Notification {
    return this.createNotification(
      userId,
      '❌ Withdrawal Rejected',
      `Your withdrawal request of TZS ${amount.toLocaleString()} has been rejected and the amount has been refunded to your balance. Reason: ${reason}`,
      'error',
      undefined,
      withdrawalId
    );
  }

  /**
   * Create account blocked notification
   */
  static createAccountBlockedNotification(
    userId: string,
    reason: string
  ): Notification {
    return this.createNotification(
      userId,
      '🚫 Account Blocked',
      `Your account has been blocked. Reason: ${reason}. Please contact administrator for assistance.`,
      'error'
    );
  }

  /**
   * Create account unblocked notification
   */
  static createAccountUnblockedNotification(userId: string): Notification {
    return this.createNotification(
      userId,
      '✅ Account Unblocked',
      'Your account has been unblocked. You can now use all features normally.',
      'success'
    );
  }
}
