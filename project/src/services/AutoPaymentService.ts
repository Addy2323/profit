import { NotificationService } from './NotificationService';

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
  paymentNumber?: string;
  rejectionReason?: string;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  amount: number;
  method: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  requestedAt: Date;
  processedAt?: Date;
  processedBy?: string;
  rejectionReason?: string;
  details?: {
    phoneNumber?: string;
    bankAccount?: string;
    bankName?: string;
    paypalEmail?: string;
    walletAddress?: string;
  };
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

      // Validate with mobile money provider (advanced validation)
      const validationResult = await this.validateWithMobileMoneyProvider(
        transactionId,
        expectedAmount,
        network
      );

      if (!validationResult.isValid) {
        // Log failed validation attempt with details
        console.log('Transaction validation failed:', {
          transactionId,
          userId,
          expectedAmount,
          network,
          reason: validationResult.message,
          actualAmount: validationResult.actualAmount,
          receiverNumber: validationResult.receiverNumber
        });
        
        return {
          success: false,
          message: validationResult.message || 'Transaction validation failed. Please check your transaction ID and try again.',
          balance: 0
        };
      }
      
      // Log successful validation with transaction details
      console.log('Transaction validated successfully:', {
        transactionId,
        userId,
        amount: validationResult.actualAmount,
        senderNumber: validationResult.senderNumber,
        receiverNumber: validationResult.receiverNumber,
        network
      });

      // Create transaction record with sender information (PENDING status)
      const paymentNumber = this.getPaymentNumberByNetwork(network);
      const transaction: PaymentTransaction = {
        id: Date.now().toString(),
        userId,
        transactionId,
        amount: expectedAmount,
        network,
        status: 'pending',
        timestamp: new Date(),
        paymentNumber: paymentNumber?.number || '',
        senderNumber: validationResult.senderNumber,
        receiverNumber: validationResult.receiverNumber
      };

      // Store processed transaction (PENDING - awaiting admin confirmation)
      existingTransactions.push(transaction);
      localStorage.setItem('processed_transactions', JSON.stringify(existingTransactions));

      // Get current user balance (no update until admin confirms)
      const users = JSON.parse(localStorage.getItem('profitnet_users') || '[]');
      const userIndex = users.findIndex((u: any) => u.id === userId);
      const currentBalance = userIndex !== -1 ? (users[userIndex].balance || 0) : 0;

      return {
        success: true,
        message: `Deposit request of ${expectedAmount} TSH has been submitted successfully! Your transaction is pending admin confirmation.`,
        balance: currentBalance, // Return current balance (unchanged)
        transactionId: transaction.id,
        status: 'pending'
      };

    } catch (error) {
      return {
        success: false,
        message: 'Error processing transaction. Please try again.'
      };
    }
  }

  // Simulate mobile money provider validation with advanced checks
  private static async validateWithMobileMoneyProvider(
    transactionId: string,
    expectedAmount: number,
    network: string
  ): Promise<{
    isValid: boolean;
    actualAmount?: number;
    senderNumber?: string;
    receiverNumber?: string;
    message?: string;
  }> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Validate transaction ID format based on actual M-Pesa patterns
    const isValidFormat = this.validateTransactionIdFormat(transactionId, network);
    if (!isValidFormat) {
      return {
        isValid: false,
        message: 'Invalid transaction ID format for the selected network'
      };
    }

    // Simulate fetching transaction details from mobile money provider
    const transactionDetails = await this.fetchTransactionDetails(transactionId, network);
    
    if (!transactionDetails) {
      return {
        isValid: false,
        message: 'Transaction not found in mobile money records'
      };
    }

    // Validate amount matches exactly
    if (transactionDetails.amount !== expectedAmount) {
      return {
        isValid: false,
        actualAmount: transactionDetails.amount,
        message: `Amount mismatch: Transaction shows ${transactionDetails.amount} TSH, but you're trying to deposit ${expectedAmount} TSH`
      };
    }

    // Validate receiver number matches our system's payment number
    const systemPaymentNumber = this.getPaymentNumberByNetwork(network);
    if (!systemPaymentNumber || transactionDetails.receiverNumber !== systemPaymentNumber.number) {
      return {
        isValid: false,
        receiverNumber: transactionDetails.receiverNumber,
        message: `Invalid receiver: Transaction was sent to ${transactionDetails.receiverNumber}, but should be sent to ${systemPaymentNumber?.number}`
      };
    }

    // All validations passed
    return {
      isValid: true,
      actualAmount: transactionDetails.amount,
      senderNumber: transactionDetails.senderNumber,
      receiverNumber: transactionDetails.receiverNumber,
      message: 'Transaction validated successfully'
    };
  }

  // Simulate fetching transaction details from mobile money provider API
  private static async fetchTransactionDetails(
    transactionId: string,
    network: string
  ): Promise<{
    amount: number;
    senderNumber: string;
    receiverNumber: string;
    timestamp: Date;
  } | null> {
    // In real implementation, this would make actual API calls to mobile money providers
    // For demo purposes, we'll simulate realistic transaction data
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get the expected receiver number for this network
      const systemPaymentNumber = this.getPaymentNumberByNetwork(network);
      if (!systemPaymentNumber) {
        return null;
      }
      
      // Simulate transaction lookup based on transaction ID pattern
      // In real implementation, this would query the mobile money provider's API
      
      // For demo: Extract amount from transaction ID hash (simulate realistic behavior)
      const transactionHash = this.generateTransactionHash(transactionId);
      const possibleAmounts = [1000, 2000, 5000, 10000, 20000, 50000, 100000];
      const simulatedAmount = possibleAmounts[transactionHash % possibleAmounts.length];
      
      // Simulate random sender numbers (realistic Tanzanian mobile numbers)
      const senderPrefixes = ['255754', '255755', '255756', '255757', '255758', '255759'];
      const randomPrefix = senderPrefixes[transactionHash % senderPrefixes.length];
      const randomSuffix = String(100000 + (transactionHash % 900000));
      const simulatedSender = randomPrefix + randomSuffix;
      
      // 85% chance of having correct receiver (our system number)
      // 15% chance of wrong receiver (simulate copied transactions from elsewhere)
      const hasCorrectReceiver = (transactionHash % 100) < 85;
      const simulatedReceiver = hasCorrectReceiver 
        ? systemPaymentNumber.number 
        : '+255' + String(700000000 + (transactionHash % 99999999));
      
      return {
        amount: simulatedAmount,
        senderNumber: simulatedSender,
        receiverNumber: simulatedReceiver,
        timestamp: new Date(Date.now() - (transactionHash % 86400000)) // Random time within last 24 hours
      };
      
    } catch (error) {
      console.error('Error fetching transaction details:', error);
      return null;
    }
  }
  
  // Generate a consistent hash from transaction ID for simulation
  private static generateTransactionHash(transactionId: string): number {
    let hash = 0;
    for (let i = 0; i < transactionId.length; i++) {
      const char = transactionId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
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

  // Fraud detection: Check for similar transaction IDs
  private static detectSimilarTransactionId(
    newTransactionId: string,
    existingTransactions: PaymentTransaction[],
    userId: string
  ): PaymentTransaction | null {
    const userTransactions = existingTransactions.filter(t => t.userId === userId);
    
    for (const transaction of userTransactions) {
      const similarity = this.calculateTransactionIdSimilarity(newTransactionId, transaction.transactionId);
      
      // If similarity is too high (more than 80%), it's suspicious
      if (similarity > 0.8) {
        return transaction;
      }
    }
    
    return null;
  }

  // Calculate similarity between two transaction IDs using Levenshtein distance
  private static calculateTransactionIdSimilarity(str1: string, str2: string): number {
    const len1 = str1.length;
    const len2 = str2.length;
    
    // If lengths are very different, they're not similar
    if (Math.abs(len1 - len2) > 2) {
      return 0;
    }
    
    // Create a matrix for dynamic programming
    const matrix = Array(len1 + 1).fill(null).map(() => Array(len2 + 1).fill(null));
    
    // Initialize first row and column
    for (let i = 0; i <= len1; i++) matrix[i][0] = i;
    for (let j = 0; j <= len2; j++) matrix[0][j] = j;
    
    // Fill the matrix
    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,     // deletion
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j - 1] + cost // substitution
        );
      }
    }
    
    const distance = matrix[len1][len2];
    const maxLength = Math.max(len1, len2);
    
    // Return similarity as a percentage (1 - normalized distance)
    return 1 - (distance / maxLength);
  }

  // Log fraud attempts for admin monitoring
  private static logFraudAttempt(userId: string, attemptedTransactionId: string, similarTransactionId: string): void {
    try {
      const fraudLogs = JSON.parse(localStorage.getItem('fraud_attempts') || '[]');
      
      const fraudAttempt = {
        id: Date.now().toString(),
        userId,
        attemptedTransactionId,
        similarTransactionId,
        timestamp: new Date(),
        type: 'similar_transaction_id',
        severity: 'high'
      };
      
      fraudLogs.unshift(fraudAttempt);
      
      // Keep only last 1000 fraud attempts
      if (fraudLogs.length > 1000) {
        fraudLogs.splice(1000);
      }
      
      localStorage.setItem('fraud_attempts', JSON.stringify(fraudLogs));
      
      // Also increment user's fraud attempt counter
      this.incrementUserFraudAttempts(userId);
      
    } catch (error) {
      console.error('Error logging fraud attempt:', error);
    }
  }

  // Increment user's fraud attempt counter
  private static incrementUserFraudAttempts(userId: string): void {
    try {
      const users = JSON.parse(localStorage.getItem('profitnet_users') || '[]');
      const userIndex = users.findIndex((u: any) => u.id === userId);
      
      if (userIndex !== -1) {
        users[userIndex].fraudAttempts = (users[userIndex].fraudAttempts || 0) + 1;
        users[userIndex].lastFraudAttempt = new Date();
        
        // Block user if too many fraud attempts (3 or more)
        if (users[userIndex].fraudAttempts >= 3) {
          users[userIndex].isBlocked = true;
          users[userIndex].blockReason = 'Multiple suspicious transaction attempts';
          
          // Trigger immediate logout by dispatching a custom event
          window.dispatchEvent(new CustomEvent('userBlocked', { 
            detail: { 
              userId: userId,
              reason: 'Multiple suspicious transaction attempts'
            }
          }));
        }
        
        localStorage.setItem('profitnet_users', JSON.stringify(users));
      }
    } catch (error) {
      console.error('Error incrementing fraud attempts:', error);
    }
  }

  // Admin function to get fraud attempts
  static getFraudAttempts(): any[] {
    return JSON.parse(localStorage.getItem('fraud_attempts') || '[]');
  }

  // Admin function to clear user fraud attempts and unblock user
  static clearUserFraudAttempts(userId: string): boolean {
    try {
      const users = JSON.parse(localStorage.getItem('profitnet_users') || '[]');
      const userIndex = users.findIndex((u: any) => u.id === userId);
      
      if (userIndex !== -1) {
        users[userIndex].fraudAttempts = 0;
        users[userIndex].isBlocked = false;
        delete users[userIndex].blockReason;
        localStorage.setItem('profitnet_users', JSON.stringify(users));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error clearing user fraud attempts:', error);
      return false;
    }
  }

  // Admin function to confirm a pending transaction
  static confirmTransaction(transactionId: string): {
    success: boolean;
    message: string;
    transaction?: PaymentTransaction;
  } {
    try {
      const transactions = JSON.parse(localStorage.getItem('processed_transactions') || '[]');
      const transactionIndex = transactions.findIndex((t: PaymentTransaction) => t.id === transactionId);
      
      if (transactionIndex === -1) {
        return {
          success: false,
          message: 'Transaction not found'
        };
      }
      
      const transaction = transactions[transactionIndex];
      
      if (transaction.status !== 'pending') {
        return {
          success: false,
          message: `Transaction is already ${transaction.status}`
        };
      }
      
      // Update transaction status to confirmed
      transactions[transactionIndex].status = 'confirmed';
      localStorage.setItem('processed_transactions', JSON.stringify(transactions));
      
      // Update user balance
      const users = JSON.parse(localStorage.getItem('profitnet_users') || '[]');
      const userIndex = users.findIndex((u: any) => u.id === transaction.userId);
      
      if (userIndex !== -1) {
        users[userIndex].balance = (users[userIndex].balance || 0) + transaction.amount;
        localStorage.setItem('profitnet_users', JSON.stringify(users));
        
        // Add to user's transaction history
        const userTransactions = JSON.parse(localStorage.getItem(`user_transactions_${transaction.userId}`) || '[]');
        userTransactions.push({
          id: transaction.id,
          type: 'deposit',
          amount: transaction.amount,
          description: `Mobile Money Deposit - ${transaction.transactionId}`,
          timestamp: new Date(),
          status: 'confirmed'
        });
        localStorage.setItem(`user_transactions_${transaction.userId}`, JSON.stringify(userTransactions));
        
        // Send notification to user
        NotificationService.createDepositConfirmationNotification(
          transaction.userId,
          transaction.amount,
          transaction.id
        );
      }
      
      return {
        success: true,
        message: `Transaction confirmed successfully! User balance updated with ${transaction.amount} TSH.`,
        transaction: transactions[transactionIndex]
      };
      
    } catch (error) {
      console.error('Error confirming transaction:', error);
      return {
        success: false,
        message: 'Error confirming transaction. Please try again.'
      };
    }
  }

  // Admin function to reject a pending transaction
  static rejectTransaction(transactionId: string, reason?: string): {
    success: boolean;
    message: string;
    transaction?: PaymentTransaction;
  } {
    try {
      const transactions = JSON.parse(localStorage.getItem('processed_transactions') || '[]');
      const transactionIndex = transactions.findIndex((t: PaymentTransaction) => t.id === transactionId);
      
      if (transactionIndex === -1) {
        return {
          success: false,
          message: 'Transaction not found'
        };
      }
      
      const transaction = transactions[transactionIndex];
      
      if (transaction.status !== 'pending') {
        return {
          success: false,
          message: `Transaction is already ${transaction.status}`
        };
      }
      
      // Update transaction status to rejected
      transactions[transactionIndex].status = 'failed';
      transactions[transactionIndex].rejectionReason = reason || 'Rejected by admin';
      localStorage.setItem('processed_transactions', JSON.stringify(transactions));
      
      // Add rejection to user's transaction history
      const userTransactions = JSON.parse(localStorage.getItem(`user_transactions_${transaction.userId}`) || '[]');
      userTransactions.push({
        id: transaction.id,
        type: 'deposit',
        amount: transaction.amount,
        description: `Mobile Money Deposit - ${transaction.transactionId} (REJECTED)`,
        timestamp: new Date(),
        status: 'failed',
        reason: reason || 'Rejected by admin'
      });
      localStorage.setItem(`user_transactions_${transaction.userId}`, JSON.stringify(userTransactions));
      
      // Send notification to user
      NotificationService.createDepositRejectionNotification(
        transaction.userId,
        transaction.amount,
        reason || 'Rejected by admin',
        transaction.id
      );
      
      return {
        success: true,
        message: `Transaction rejected successfully. Reason: ${reason || 'Rejected by admin'}`,
        transaction: transactions[transactionIndex]
      };
      
    } catch (error) {
      console.error('Error rejecting transaction:', error);
      return {
        success: false,
        message: 'Error rejecting transaction. Please try again.'
      };
    }
  }

  // Get all pending transactions for admin review
  static getPendingTransactions(): PaymentTransaction[] {
    try {
      const transactions = JSON.parse(localStorage.getItem('processed_transactions') || '[]');
      return transactions.filter((t: PaymentTransaction) => t.status === 'pending');
    } catch (error) {
      console.error('Error getting pending transactions:', error);
      return [];
    }
  }

  // ===== WITHDRAWAL MANAGEMENT FUNCTIONS =====

  // Create a new withdrawal request
  static createWithdrawalRequest(userId: string, amount: number, method: string, details?: any): { success: boolean; message: string; request?: WithdrawalRequest } {
    try {
      // Validate user balance
      const users = JSON.parse(localStorage.getItem('profitnet_users') || '[]');
      const user = users.find((u: any) => u.id === userId);
      
      if (!user) {
        return { success: false, message: 'User not found' };
      }
      
      if ((user.balance || 0) < amount) {
        return { success: false, message: 'Insufficient balance' };
      }
      
      // Create withdrawal request
      const withdrawalRequest: WithdrawalRequest = {
        id: `wr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        amount,
        method,
        status: 'pending',
        requestedAt: new Date(),
        details
      };
      
      // Store withdrawal request
      const withdrawalRequests = JSON.parse(localStorage.getItem('withdrawal_requests') || '[]');
      withdrawalRequests.push(withdrawalRequest);
      localStorage.setItem('withdrawal_requests', JSON.stringify(withdrawalRequests));
      
      // Deduct balance immediately (pending approval)
      const userIndex = users.findIndex((u: any) => u.id === userId);
      if (userIndex !== -1) {
        users[userIndex].balance = (users[userIndex].balance || 0) - amount;
        localStorage.setItem('profitnet_users', JSON.stringify(users));
      }
      
      // Add to user's transaction history as pending
      const userTransactions = JSON.parse(localStorage.getItem(`user_transactions_${userId}`) || '[]');
      userTransactions.push({
        id: withdrawalRequest.id,
        type: 'withdrawal',
        amount: -amount, // Negative for withdrawal
        description: `Withdrawal Request - ${method}`,
        timestamp: new Date(),
        status: 'pending'
      });
      localStorage.setItem(`user_transactions_${userId}`, JSON.stringify(userTransactions));
      
      console.log('Withdrawal request created:', withdrawalRequest);
      
      return {
        success: true,
        message: `Withdrawal request for ${amount.toLocaleString()} TZS submitted successfully! Your request is pending admin approval.`,
        request: withdrawalRequest
      };
      
    } catch (error) {
      console.error('Error creating withdrawal request:', error);
      return {
        success: false,
        message: 'Error creating withdrawal request. Please try again.'
      };
    }
  }

  // Get all withdrawal requests
  static getWithdrawalRequests(status?: WithdrawalRequest['status']): WithdrawalRequest[] {
    try {
      const requests = JSON.parse(localStorage.getItem('withdrawal_requests') || '[]');
      if (status) {
        return requests.filter((r: WithdrawalRequest) => r.status === status);
      }
      return requests.sort((a: WithdrawalRequest, b: WithdrawalRequest) => 
        new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime()
      );
    } catch (error) {
      console.error('Error getting withdrawal requests:', error);
      return [];
    }
  }

  // Get pending withdrawal requests
  static getPendingWithdrawals(): WithdrawalRequest[] {
    return this.getWithdrawalRequests('pending');
  }

  // Approve withdrawal request
  static approveWithdrawal(requestId: string, adminId: string = 'admin'): { success: boolean; message: string; request?: WithdrawalRequest } {
    try {
      const requests = JSON.parse(localStorage.getItem('withdrawal_requests') || '[]');
      const requestIndex = requests.findIndex((r: WithdrawalRequest) => r.id === requestId);
      
      if (requestIndex === -1) {
        return { success: false, message: 'Withdrawal request not found' };
      }
      
      const request = requests[requestIndex];
      
      if (request.status !== 'pending') {
        return { success: false, message: 'Withdrawal request is not pending' };
      }
      
      // Update request status
      requests[requestIndex] = {
        ...request,
        status: 'approved',
        processedAt: new Date(),
        processedBy: adminId
      };
      
      localStorage.setItem('withdrawal_requests', JSON.stringify(requests));
      
      // Update user's transaction history
      const userTransactions = JSON.parse(localStorage.getItem(`user_transactions_${request.userId}`) || '[]');
      const transactionIndex = userTransactions.findIndex((t: any) => t.id === requestId);
      
      if (transactionIndex !== -1) {
        userTransactions[transactionIndex] = {
          ...userTransactions[transactionIndex],
          status: 'confirmed',
          description: `Withdrawal Approved - ${request.method}`,
          timestamp: new Date()
        };
        localStorage.setItem(`user_transactions_${request.userId}`, JSON.stringify(userTransactions));
      }
      
      console.log('Withdrawal approved:', requests[requestIndex]);
      
      // Send notification to user
      NotificationService.createWithdrawalApprovalNotification(
        request.userId,
        request.amount,
        requestId
      );
      
      return {
        success: true,
        message: `Withdrawal request for ${request.amount.toLocaleString()} TZS approved successfully!`,
        request: requests[requestIndex]
      };
      
    } catch (error) {
      console.error('Error approving withdrawal:', error);
      return {
        success: false,
        message: 'Error approving withdrawal request. Please try again.'
      };
    }
  }

  // Reject withdrawal request
  static rejectWithdrawal(requestId: string, reason?: string, adminId: string = 'admin'): { success: boolean; message: string; request?: WithdrawalRequest } {
    try {
      const requests = JSON.parse(localStorage.getItem('withdrawal_requests') || '[]');
      const requestIndex = requests.findIndex((r: WithdrawalRequest) => r.id === requestId);
      
      if (requestIndex === -1) {
        return { success: false, message: 'Withdrawal request not found' };
      }
      
      const request = requests[requestIndex];
      
      if (request.status !== 'pending') {
        return { success: false, message: 'Withdrawal request is not pending' };
      }
      
      // Update request status
      requests[requestIndex] = {
        ...request,
        status: 'rejected',
        processedAt: new Date(),
        processedBy: adminId,
        rejectionReason: reason
      };
      
      localStorage.setItem('withdrawal_requests', JSON.stringify(requests));
      
      // Refund the balance (since it was deducted when request was created)
      const users = JSON.parse(localStorage.getItem('profitnet_users') || '[]');
      const userIndex = users.findIndex((u: any) => u.id === request.userId);
      
      if (userIndex !== -1) {
        users[userIndex].balance = (users[userIndex].balance || 0) + request.amount;
        localStorage.setItem('profitnet_users', JSON.stringify(users));
      }
      
      // Update user's transaction history
      const userTransactions = JSON.parse(localStorage.getItem(`user_transactions_${request.userId}`) || '[]');
      const transactionIndex = userTransactions.findIndex((t: any) => t.id === requestId);
      
      if (transactionIndex !== -1) {
        userTransactions[transactionIndex] = {
          ...userTransactions[transactionIndex],
          status: 'failed',
          description: `Withdrawal Rejected - ${request.method}${reason ? ` (${reason})` : ''}`,
          timestamp: new Date()
        };
        localStorage.setItem(`user_transactions_${request.userId}`, JSON.stringify(userTransactions));
      }
      
      console.log('Withdrawal rejected:', requests[requestIndex]);
      
      // Send notification to user
      NotificationService.createWithdrawalRejectionNotification(
        request.userId,
        request.amount,
        reason || 'No reason provided',
        requestId
      );
      
      return {
        success: true,
        message: `Withdrawal request rejected successfully. ${reason ? `Reason: ${reason}` : ''}`,
        request: requests[requestIndex]
      };
      
    } catch (error) {
      console.error('Error rejecting withdrawal:', error);
      return {
        success: false,
        message: 'Error rejecting withdrawal request. Please try again.'
      };
    }
  }
}
