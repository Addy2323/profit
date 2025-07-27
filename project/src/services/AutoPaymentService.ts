export interface PaymentNumber {
  id: string;
  network: string;
  number: string;
  name: string;
  isActive: boolean;
}

export interface PaymentTransaction {
  id: string;
  transactionId: string;
  amount: number;
  senderNumber: string;
  receiverNumber: string;
  network: string;
  timestamp: Date;
  status: 'pending' | 'confirmed' | 'failed';
  userId?: string;
}

export class AutoPaymentService {
  private static readonly PAYMENT_NUMBERS: PaymentNumber[] = [
    {
      id: '1',
      network: 'vodacom',
      number: '+255765123456',
      name: 'Investment Hub - Vodacom',
      isActive: true
    },
    {
      id: '2', 
      network: 'tigo',
      number: '+255654321098',
      name: 'Investment Hub - Tigo',
      isActive: true
    },
    {
      id: '3',
      network: 'airtel',
      number: '+255743210987', 
      name: 'Investment Hub - Airtel',
      isActive: true
    }
  ];

  // Get all active payment numbers
  static getPaymentNumbers(): PaymentNumber[] {
    return this.PAYMENT_NUMBERS.filter(num => num.isActive);
  }

  // Get payment number by network
  static getPaymentNumberByNetwork(network: string): PaymentNumber | undefined {
    return this.PAYMENT_NUMBERS.find(num => num.network === network && num.isActive);
  }

  // Simulate checking for incoming payments (in real implementation, this would connect to mobile money APIs)
  static async checkIncomingPayments(): Promise<PaymentTransaction[]> {
    // This would normally connect to mobile money provider APIs
    // For now, we'll simulate with localStorage
    const pendingPayments = JSON.parse(localStorage.getItem('pending_payments') || '[]');
    return pendingPayments;
  }

  // Process transaction ID and validate payment
  static async processTransactionId(
    transactionId: string,
    expectedAmount: number,
    userId: string,
    network: string
  ): Promise<{
    success: boolean;
    message: string;
    transaction?: PaymentTransaction;
  }> {
    try {
      // Validate transaction ID format
      if (!transactionId || transactionId.length < 8) {
        return {
          success: false,
          message: 'Invalid transaction ID format'
        };
      }

      // Check if transaction ID already exists
      const existingTransactions = JSON.parse(localStorage.getItem('processed_transactions') || '[]');
      const duplicate = existingTransactions.find((t: PaymentTransaction) => t.transactionId === transactionId);
      
      if (duplicate) {
        return {
          success: false,
          message: 'Transaction ID already processed'
        };
      }

      // Simulate payment validation (in real implementation, this would verify with mobile money provider)
      const isValid = await this.validateWithMobileMoneyProvider(transactionId, expectedAmount, network);
      
      if (!isValid) {
        return {
          success: false,
          message: 'Transaction not found or invalid. Please check your transaction ID.'
        };
      }

      // Create transaction record
      const transaction: PaymentTransaction = {
        id: Date.now().toString(),
        transactionId,
        amount: expectedAmount,
        senderNumber: 'Unknown', // Would be retrieved from API
        receiverNumber: this.getPaymentNumberByNetwork(network)?.number || '',
        network,
        timestamp: new Date(),
        status: 'confirmed',
        userId
      };

      // Store processed transaction
      existingTransactions.push(transaction);
      localStorage.setItem('processed_transactions', JSON.stringify(existingTransactions));

      return {
        success: true,
        message: 'Payment confirmed successfully!',
        transaction
      };

    } catch (error) {
      return {
        success: false,
        message: 'Error processing transaction. Please try again.'
      };
    }
  }

  // Simulate mobile money provider validation
  private static async validateWithMobileMoneyProvider(
    transactionId: string,
    amount: number,
    network: string
  ): Promise<boolean> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate validation logic
    // In real implementation, this would make actual API calls to mobile money providers
    
    // For demo purposes, we'll consider transaction valid if:
    // 1. Transaction ID starts with network prefix
    // 2. Amount is reasonable (> 0)
    const networkPrefixes: { [key: string]: string } = {
      'vodacom': 'MP',
      'tigo': 'TG',
      'airtel': 'AT',
      'halotel': 'HL'
    };

    const expectedPrefix = networkPrefixes[network];
    const hasValidPrefix = expectedPrefix ? transactionId.toUpperCase().startsWith(expectedPrefix) : true;
    const hasValidAmount = amount > 0;

    // Simulate 90% success rate for valid-looking transactions
    const randomSuccess = Math.random() > 0.1;

    return hasValidPrefix && hasValidAmount && randomSuccess;
  }

  // Auto-update user balance after successful payment
  static async updateUserBalance(userId: string, amount: number): Promise<boolean> {
    try {
      // Get current users
      const users = JSON.parse(localStorage.getItem('profitnet_users') || '[]');
      const userIndex = users.findIndex((u: any) => u.id === userId);

      if (userIndex === -1) {
        return false;
      }

      // Update balance
      users[userIndex].balance = (users[userIndex].balance || 0) + amount;
      
      // Save updated users
      localStorage.setItem('profitnet_users', JSON.stringify(users));

      // Add transaction to user's history
      const transaction = {
        id: Date.now().toString(),
        userId,
        type: 'recharge' as const,
        amount,
        description: 'Mobile money recharge - Auto processed',
        status: 'completed' as const,
        createdAt: new Date(),
      };

      const userTransactions = JSON.parse(localStorage.getItem(`transactions_${userId}`) || '[]');
      userTransactions.unshift(transaction);
      localStorage.setItem(`transactions_${userId}`, JSON.stringify(userTransactions));

      return true;
    } catch (error) {
      console.error('Error updating user balance:', error);
      return false;
    }
  }

  // Get transaction history for admin
  static getTransactionHistory(): PaymentTransaction[] {
    return JSON.parse(localStorage.getItem('processed_transactions') || '[]');
  }

  // Admin function to manually confirm pending transactions
  static async confirmTransaction(transactionId: string): Promise<boolean> {
    try {
      const transactions = JSON.parse(localStorage.getItem('processed_transactions') || '[]');
      const transaction = transactions.find((t: PaymentTransaction) => t.id === transactionId);
      
      if (transaction && transaction.status === 'pending') {
        transaction.status = 'confirmed';
        localStorage.setItem('processed_transactions', JSON.stringify(transactions));
        
        // Update user balance if userId exists
        if (transaction.userId) {
          await this.updateUserBalance(transaction.userId, transaction.amount);
        }
        
        return true;
      }
      
      return false;
    } catch (error) {
      return false;
    }
  }

  // Admin methods for managing transactions
  static confirmTransaction(transactionId: string): Promise<boolean> {
    return new Promise((resolve) => {
      const transactions = this.getTransactionHistory();
      const transactionIndex = transactions.findIndex(t => t.id === transactionId);
      
      if (transactionIndex !== -1) {
        transactions[transactionIndex].status = 'confirmed';
        localStorage.setItem('payment_transactions', JSON.stringify(transactions));
        resolve(true);
      } else {
        resolve(false);
      }
    });
  }

  static getTransactionHistory(): PaymentTransaction[] {
    const stored = localStorage.getItem('payment_transactions');
    return stored ? JSON.parse(stored) : [];
  }

  static getPaymentNumbers(): PaymentNumber[] {
    return this.PAYMENT_NUMBERS;
  }
}
