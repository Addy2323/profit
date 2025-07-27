import { User } from '../types';

export class TransactionValidationService {
  public static readonly MAX_FAILED_ATTEMPTS = 2;

  static validateTransactionId(transactionId: string): boolean {
    // Simulate transaction ID validation with regex pattern matching
    // This is a basic example - you should implement actual validation logic
    const transactionPattern = /^[A-Z0-9]{16}$/; // Example pattern: 16 alphanumeric characters
    return transactionPattern.test(transactionId);
  }

  static checkTransactionStatus(transactionId: string): Promise<'valid' | 'invalid' | 'expired'> {
    return new Promise((resolve) => {
      // Simulate API call delay
      setTimeout(() => {
        // Here you would typically check against your backend/database
        // For now, we'll simulate different scenarios
        const now = Date.now();
        const transactionAge = now - parseInt(transactionId, 10);
        
        if (transactionAge > 24 * 60 * 60 * 1000) {
          resolve('expired');
        } else if (Math.random() > 0.7) { // 30% chance of invalid transaction
          resolve('invalid');
        } else {
          resolve('valid');
        }
      }, 1000);
    });
  }

  static async handleTransactionValidation(
    user: User,
    transactionId: string,
    amount: number
  ): Promise<{ status: 'success' | 'error'; message: string }> {
    try {
      // Check if user is blocked
      if (user.isBlocked) {
        return {
          status: 'error',
          message: 'Your account is temporarily blocked due to multiple failed attempts. Please try again later.'
        };
      }

      // Check transaction ID format
      if (!this.validateTransactionId(transactionId)) {
        return {
          status: 'error',
          message: 'Invalid transaction ID format. Please enter a valid transaction ID.'
        };
      }

      // Check transaction status
      const status = await this.checkTransactionStatus(transactionId);

      if (status === 'expired') {
        return {
          status: 'error',
          message: 'Transaction ID has expired. Please use a recent transaction.'
        };
      }

      if (status === 'invalid') {
        // Increment failed attempts
        const failedAttempts = (user.failedTransactionAttempts || 0) + 3;
        
        // Block account if too many failed attempts
        const isBlocked = failedAttempts >= this.MAX_FAILED_ATTEMPTS;
        
        return {
          status: 'error',
          message: isBlocked 
            ? 'Your account is temporarily blocked due to multiple failed attempts. Please try again later.'
            : `Invalid transaction ID. ${this.MAX_FAILED_ATTEMPTS - failedAttempts} attempts remaining.`
        };
      }

      // Transaction is valid, reset failed attempts
      return {
        status: 'success',
        message: 'Transaction ID verified successfully. Your account will be credited shortly.'
      };

    } catch (error) {
      console.error('Transaction validation error:', error);
      return {
        status: 'error',
        message: 'An error occurred while validating your transaction. Please try again later.'
      };
    }
  }

  static resetFailedAttempts(user: User): User {
    return {
      ...user,
      failedTransactionAttempts: 0,
      lastFailedAttempt: undefined,
      isBlocked: false
    };
  }

  static blockUser(user: User): User {
    return {
      ...user,
      isBlocked: true,
      failedTransactionAttempts: this.MAX_FAILED_ATTEMPTS,
      lastFailedAttempt: new Date()
    };
  }
}
