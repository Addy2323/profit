import { Product, RechargeNumber, Transaction, Purchase, LuckyDraw } from '../types';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Gaming Bundle',
    description: 'Access to premium gaming content and exclusive features',
    price: 15000,
    type: 'vip',
    durationDays: 90,
    isActive: true,
    category: 'Gaming',
    imageUrl: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '2',
    name: 'Music Streaming Pro',
    description: 'Unlimited music streaming with offline downloads',
    price: 8000,
    type: 'normal',
    durationDays: 60,
    isActive: true,
    category: 'Entertainment',
    imageUrl: 'https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '3',
    name: 'Educational Platform Access',
    description: 'Full access to online learning platform and courses',
    price: 12000,
    type: 'vip',
    durationDays: 90,
    isActive: true,
    category: 'Education',
    imageUrl: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '4',
    name: 'Cloud Storage Plus',
    description: 'Extended cloud storage with advanced backup features',
    price: 6000,
    type: 'normal',
    durationDays: 60,
    isActive: true,
    category: 'Productivity',
    imageUrl: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '5',
    name: 'Fitness App Premium',
    description: 'Personal trainer AI and nutrition tracking',
    price: 10000,
    type: 'vip',
    durationDays: 90,
    isActive: true,
    category: 'Health',
    imageUrl: 'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '6',
    name: 'News & Magazine Bundle',
    description: 'Access to premium news sources and digital magazines',
    price: 5000,
    type: 'normal',
    durationDays: 60,
    isActive: true,
    category: 'News',
    imageUrl: 'https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
];

export const rechargeNumbers: RechargeNumber[] = [
  { id: '1', network: 'vodacom', number: '+255765123456', isActive: true },
  { id: '2', network: 'vodacom', number: '+255765789012', isActive: true },
  { id: '3', network: 'tigo', number: '+255654321098', isActive: true },
  { id: '4', network: 'tigo', number: '+255654567890', isActive: true },
  { id: '5', network: 'airtel', number: '+255743210987', isActive: true },
  { id: '6', network: 'airtel', number: '+255743456789', isActive: true },
  { id: '7', network: 'halotel', number: '+255623456789', isActive: true },
  { id: '8', network: 'halotel', number: '+255623210987', isActive: true },
];

export const getRandomNumber = (network: string): string => {
  const networkNumbers = rechargeNumbers.filter(n => n.network === network && n.isActive);
  const randomIndex = Math.floor(Math.random() * networkNumbers.length);
  return networkNumbers[randomIndex]?.number || '';
};

export const networkColors = {
  vodacom: 'from-red-500 to-red-600',
  tigo: 'from-blue-500 to-blue-600',
  airtel: 'from-red-600 to-orange-500',
  halotel: 'from-purple-500 to-purple-600',
};

export const networkLogos = {
  vodacom: '🔴',
  tigo: '🔵',
  airtel: '🟠',
  halotel: '🟣',
};

export const generateMockTransactions = (userId: string): Transaction[] => {
  return [
    {
      id: '1',
      userId,
      type: 'recharge',
      amount: 20000,
      description: 'Mobile money recharge via Vodacom',
      status: 'completed',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
    {
      id: '2',
      userId,
      type: 'purchase',
      amount: -15000,
      description: 'Premium Gaming Bundle purchase',
      status: 'completed',
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    },
    {
      id: '3',
      userId,
      type: 'referral',
      amount: 2000,
      description: 'Referral bonus from new user',
      status: 'completed',
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    },
  ];
};

export const luckyDrawPrizes = [
  { name: 'Balance Bonus', value: 1000, probability: 0.3 },
  { name: 'Premium Product', value: 'product', probability: 0.1 },
  { name: 'Small Bonus', value: 500, probability: 0.4 },
  { name: 'Jackpot!', value: 5000, probability: 0.05 },
  { name: 'Better Luck Next Time', value: 0, probability: 0.15 },
];

export const getRandomPrize = () => {
  const random = Math.random();
  let cumulativeProbability = 0;
  
  for (const prize of luckyDrawPrizes) {
    cumulativeProbability += prize.probability;
    if (random <= cumulativeProbability) {
      return prize;
    }
  }
  
  return luckyDrawPrizes[luckyDrawPrizes.length - 1];
};