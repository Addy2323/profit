export interface InvestmentPlan {
  id: string;
  name: string;
  description: string;
  minAmount: number;
  maxAmount: number;
  dailyReturnRate: number; // Percentage (e.g., 2.5 for 2.5%)
  duration: number; // Days
  totalReturnRate: number; // Calculated total return percentage
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  features: string[];
  riskLevel: 'Low' | 'Medium' | 'High';
  category: 'Starter' | 'Professional' | 'Premium' | 'VIP';
}

export interface PlanInvestment {
  id: string;
  userId: string;
  planId: string;
  amount: number;
  startDate: Date;
  endDate: Date;
  dailyReturn: number;
  totalReturn: number;
  status: 'Active' | 'Completed' | 'Cancelled';
  daysRemaining: number;
  totalEarned: number;
}
