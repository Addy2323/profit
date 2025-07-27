export interface UserActivity {
  id: string;
  userId: string;
  action: string;
  details: string;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}

export interface UserStatus {
  isActive: boolean;
  isBanned: boolean;
  banReason?: string;
  bannedAt?: Date;
  bannedBy?: string;
  suspensionEndDate?: Date;
}

export interface FraudAlert {
  id: string;
  userId: string;
  type: 'deposit_anomaly' | 'withdrawal_anomaly' | 'suspicious_pattern' | 'multiple_accounts';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  detectedAt: Date;
  status: 'pending' | 'investigating' | 'resolved' | 'false_positive';
  investigatedBy?: string;
  resolution?: string;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  amount: number;
  requestedAt: Date;
  status: 'pending' | 'approved' | 'rejected' | 'processing' | 'completed';
  reviewedBy?: string;
  reviewedAt?: Date;
  rejectionReason?: string;
  transactionId?: string;
}
