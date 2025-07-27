import { InvestmentPlan, PlanInvestment } from '../types/InvestmentPlan';

export class InvestmentPlanService {
  private static readonly PLANS_KEY = 'profitnet_investment_plans';
  private static readonly INVESTMENTS_KEY = 'profitnet_plan_investments';

  // Get all investment plans
  static getAllPlans(): InvestmentPlan[] {
    const plans = localStorage.getItem(this.PLANS_KEY);
    return plans ? JSON.parse(plans) : this.getDefaultPlans();
  }

  // Get active investment plans
  static getActivePlans(): InvestmentPlan[] {
    return this.getAllPlans().filter(plan => plan.isActive);
  }

  // Get plan by ID
  static getPlanById(id: string): InvestmentPlan | null {
    const plans = this.getAllPlans();
    return plans.find(plan => plan.id === id) || null;
  }

  // Create new investment plan
  static createPlan(planData: Omit<InvestmentPlan, 'id' | 'createdAt' | 'updatedAt' | 'totalReturnRate'>): InvestmentPlan {
    const plans = this.getAllPlans();
    const newPlan: InvestmentPlan = {
      ...planData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      totalReturnRate: planData.dailyReturnRate * planData.duration
    };
    
    plans.push(newPlan);
    localStorage.setItem(this.PLANS_KEY, JSON.stringify(plans));
    return newPlan;
  }

  // Update investment plan
  static updatePlan(id: string, updates: Partial<InvestmentPlan>): InvestmentPlan | null {
    const plans = this.getAllPlans();
    const planIndex = plans.findIndex(plan => plan.id === id);
    
    if (planIndex === -1) return null;
    
    const updatedPlan = {
      ...plans[planIndex],
      ...updates,
      updatedAt: new Date(),
      totalReturnRate: (updates.dailyReturnRate || plans[planIndex].dailyReturnRate) * 
                      (updates.duration || plans[planIndex].duration)
    };
    
    plans[planIndex] = updatedPlan;
    localStorage.setItem(this.PLANS_KEY, JSON.stringify(plans));
    return updatedPlan;
  }

  // Delete investment plan
  static deletePlan(id: string): boolean {
    const plans = this.getAllPlans();
    const filteredPlans = plans.filter(plan => plan.id !== id);
    
    if (filteredPlans.length === plans.length) return false;
    
    localStorage.setItem(this.PLANS_KEY, JSON.stringify(filteredPlans));
    return true;
  }

  // Get user investments
  static getUserInvestments(userId: string): PlanInvestment[] {
    const investments = localStorage.getItem(this.INVESTMENTS_KEY);
    const allInvestments: PlanInvestment[] = investments ? JSON.parse(investments) : [];
    return allInvestments.filter(inv => inv.userId === userId);
  }

  // Create user investment
  static createInvestment(userId: string, planId: string, amount: number): PlanInvestment | null {
    const plan = this.getPlanById(planId);
    if (!plan) return null;

    const investments = localStorage.getItem(this.INVESTMENTS_KEY);
    const allInvestments: PlanInvestment[] = investments ? JSON.parse(investments) : [];
    
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + plan.duration);
    
    const newInvestment: PlanInvestment = {
      id: Date.now().toString(),
      userId,
      planId,
      amount,
      startDate,
      endDate,
      dailyReturn: (amount * plan.dailyReturnRate) / 100,
      totalReturn: (amount * plan.totalReturnRate) / 100,
      status: 'Active',
      daysRemaining: plan.duration,
      totalEarned: 0
    };
    
    allInvestments.push(newInvestment);
    localStorage.setItem(this.INVESTMENTS_KEY, JSON.stringify(allInvestments));
    return newInvestment;
  }

  // Get default investment plans
  private static getDefaultPlans(): InvestmentPlan[] {
    const defaultPlans: InvestmentPlan[] = [
      {
        id: '1',
        name: 'Starter Plan',
        description: 'Perfect for beginners looking to start their investment journey',
        minAmount: 10000,
        maxAmount: 100000,
        dailyReturnRate: 1.5,
        duration: 30,
        totalReturnRate: 45,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        features: ['Daily Returns', 'Low Risk', 'Flexible Withdrawal'],
        riskLevel: 'Low',
        category: 'Starter'
      },
      {
        id: '2',
        name: 'Professional Plan',
        description: 'For experienced investors seeking higher returns',
        minAmount: 100000,
        maxAmount: 500000,
        dailyReturnRate: 2.5,
        duration: 45,
        totalReturnRate: 112.5,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        features: ['Higher Returns', 'Priority Support', 'Advanced Analytics'],
        riskLevel: 'Medium',
        category: 'Professional'
      },
      {
        id: '3',
        name: 'Premium Plan',
        description: 'High-yield investment for serious investors',
        minAmount: 500000,
        maxAmount: 2000000,
        dailyReturnRate: 3.5,
        duration: 60,
        totalReturnRate: 210,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        features: ['Maximum Returns', 'VIP Support', 'Personal Manager'],
        riskLevel: 'High',
        category: 'Premium'
      }
    ];
    
    localStorage.setItem(this.PLANS_KEY, JSON.stringify(defaultPlans));
    return defaultPlans;
  }
}
