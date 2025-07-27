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
      number: '+255768828247',
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
      // Validate transaction ID format - accept M-Pesa format
      if (!transactionId || transactionId.length < 8 || transactionId.length > 15) {
        return {
          success: false,
          message: 'Invalid transaction ID format. Please enter a valid M-Pesa transaction ID.'
        };
      }

      // Check for valid characters (alphanumeric)
      if (!/^[A-Za-z0-9]+$/.test(transactionId)) {
        return {
          success: false,
          message: 'Transaction ID contains invalid characters. Only letters and numbers are allowed.'
        };
      }

      // Check if transaction ID already exists or is similar (fraud prevention)
      const existingTransactions = JSON.parse(localStorage.getItem('processed_transactions') || '[]');
      
      // Check for exact duplicate
      const duplicate = existingTransactions.find((t: PaymentTransaction) => t.transactionId === transactionId);
      if (duplicate) {
        return {
          success: false,
          message: 'Transaction ID already processed'
        };
      }

      // Check for similar transaction IDs (fraud prevention)
      const suspiciousTransaction = this.detectSimilarTransactionId(transactionId, existingTransactions, userId);
      if (suspiciousTransaction) {
        // Log fraud attempt
        this.logFraudAttempt(userId, transactionId, suspiciousTransaction.transactionId);
        
        return {
          success: false,
          message: 'Suspicious transaction detected. This transaction ID is too similar to a previously processed transaction. Please contact support if this is a legitimate transaction.'
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
    
    // Validate transaction ID format based on actual M-Pesa patterns
    const isValidFormat = this.validateTransactionIdFormat(transactionId, network);
    const hasValidAmount = amount > 0;

    // For demo purposes, accept valid format transactions with 95% success rate
    const randomSuccess = Math.random() > 0.05;

    return isValidFormat && hasValidAmount && randomSuccess;
  }

  // Validate transaction ID format based on actual mobile money patterns
  private static validateTransactionIdFormat(transactionId: string, network: string): boolean {
    if (!transactionId || transactionId.length < 8) {
      return false;
    }

    const upperTransactionId = transactionId.toUpperCase();

    switch (network.toLowerCase()) {
      case 'vodacom':
        // M-Pesa transaction IDs can be:
        // - Traditional format: MP followed by numbers (e.g., MP1234567890)
        // - New format: Mixed alphanumeric (e.g., CED8I0O1NO8)
        return /^(MP\d{10,}|[A-Z0-9]{8,12})$/.test(upperTransactionId);
      
      case 'tigo':
        // Tigo Pesa format: Usually starts with TG or mixed alphanumeric
        return /^(TG\d{8,}|[A-Z0-9]{8,12})$/.test(upperTransactionId);
      
      case 'airtel':
        // Airtel Money format: Usually starts with AT or mixed alphanumeric
        return /^(AT\d{8,}|[A-Z0-9]{8,12})$/.test(upperTransactionId);
      
      case 'halotel':
        // Halotel format: Usually starts with HL or mixed alphanumeric
        return /^(HL\d{8,}|[A-Z0-9]{8,12})$/.test(upperTransactionId);
      
      default:
        // Generic validation for unknown networks
        return /^[A-Z0-9]{8,12}$/.test(upperTransactionId);
    }
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
}
