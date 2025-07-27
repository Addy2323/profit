export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  network?: string;
  balance: number;
  role: 'admin' | 'user' | 'superadmin';
  referralCode: string;
  referredBy?: string;
  isActive: boolean;
  failedTransactionAttempts?: number;
  lastFailedAttempt?: Date;
  isBlocked?: boolean;
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  type: 'normal' | 'vip';
  durationDays: number;
  isActive: boolean;
  category: string;
  imageUrl?: string;
}

export interface Purchase {
  id: string;
  userId: string;
  productId: string;
  product: Product;
  purchaseDate: Date;
  expiresAt: Date;
  isActive: boolean;
}

export interface RechargeNumber {
  id: string;
  network: string;
  number: string;
  isActive: boolean;
}

export interface Recharge {
  id: string;
  userId: string;
  network: string;
  numberUsed: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  transactionMessage?: string;
  createdAt: Date;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'recharge' | 'purchase' | 'withdraw' | 'referral' | 'lucky_draw';
  amount: number;
  description: string;
  status: 'completed' | 'pending' | 'failed';
  createdAt: Date;
}

export interface Referral {
  id: string;
  referrerId: string;
  referredId: string;
  rewardAmount: number;
  rewardGiven: boolean;
  createdAt: Date;
}

export interface LuckyDraw {
  id: string;
  userId: string;
  spinResult: string;
  rewardAmount?: number;
  rewardProduct?: string;
  createdAt: Date;
}

export type NetworkType = 'vodacom' | 'tigo' | 'airtel' | 'halotel';