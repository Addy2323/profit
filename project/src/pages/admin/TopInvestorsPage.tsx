import React, { useState, useEffect } from 'react';
import {
  TrophyIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  ArrowTrendingUpIcon,
  UserIcon,
  StarIcon,
  ArrowPathIcon,
  EyeIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

interface TopInvestor {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalInvested: number;
  totalReturns: number;
  activeInvestments: number;
  joinDate: string;
  lastActivity: string;
  rank: number;
  badge: 'gold' | 'silver' | 'bronze' | 'platinum';
  roi: number;
  riskLevel: 'low' | 'medium' | 'high';
  preferredPlans: string[];
}

const TopInvestorsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [investors, setInvestors] = useState<TopInvestor[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [sortBy, setSortBy] = useState<'invested' | 'returns' | 'roi'>('invested');

  useEffect(() => {
    loadTopInvestors();
  }, [selectedPeriod, sortBy]);

  const loadTopInvestors = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Sample data - in real app, this would come from API
      const sampleInvestors: TopInvestor[] = [
        {
          id: '1',
          name: 'John Mwangi',
          email: 'john.mwangi@email.com',
          phone: '+255 712 345 678',
          totalInvested: 5000000,
          totalReturns: 1250000,
          activeInvestments: 3,
          joinDate: '2024-01-15',
          lastActivity: '2024-08-05',
          rank: 1,
          badge: 'platinum',
          roi: 25.0,
          riskLevel: 'medium',
          preferredPlans: ['VIP Plan', 'Premium Plan']
        },
        {
          id: '2',
          name: 'Sarah Kimani',
          email: 'sarah.kimani@email.com',
          phone: '+255 713 456 789',
          totalInvested: 3800000,
          totalReturns: 912000,
          activeInvestments: 2,
          joinDate: '2024-02-01',
          lastActivity: '2024-08-04',
          rank: 2,
          badge: 'gold',
          roi: 24.0,
          riskLevel: 'low',
          preferredPlans: ['Premium Plan', 'Basic Plan']
        },
        {
          id: '3',
          name: 'David Mbeki',
          email: 'david.mbeki@email.com',
          phone: '+255 714 567 890',
          totalInvested: 2900000,
          totalReturns: 667000,
          activeInvestments: 4,
          joinDate: '2024-01-20',
          lastActivity: '2024-08-05',
          rank: 3,
          badge: 'gold',
          roi: 23.0,
          riskLevel: 'high',
          preferredPlans: ['VIP Plan', 'Premium Plan', 'Basic Plan']
        },
        {
          id: '4',
          name: 'Grace Nyong\'o',
          email: 'grace.nyongo@email.com',
          phone: '+255 715 678 901',
          totalInvested: 2200000,
          totalReturns: 484000,
          activeInvestments: 2,
          joinDate: '2024-03-10',
          lastActivity: '2024-08-03',
          rank: 4,
          badge: 'silver',
          roi: 22.0,
          riskLevel: 'medium',
          preferredPlans: ['Premium Plan']
        },
        {
          id: '5',
          name: 'Michael Ochieng',
          email: 'michael.ochieng@email.com',
          phone: '+255 716 789 012',
          totalInvested: 1800000,
          totalReturns: 378000,
          activeInvestments: 1,
          joinDate: '2024-04-05',
          lastActivity: '2024-08-05',
          rank: 5,
          badge: 'silver',
          roi: 21.0,
          riskLevel: 'low',
          preferredPlans: ['Basic Plan']
        }
      ];

      setInvestors(sampleInvestors);
    } catch (error) {
      console.error('Error loading top investors:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'platinum': return 'bg-purple-100 text-purple-800';
      case 'gold': return 'bg-yellow-100 text-yellow-800';
      case 'silver': return 'bg-gray-100 text-gray-800';
      case 'bronze': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getBadgeIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return '🏅';
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ArrowPathIcon className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading top investors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🏆 Top Investors Leaderboard</h1>
          <p className="text-gray-600">Recognize and track your most valuable investors</p>
        </div>

        {/* Controls */}
        <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-2">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="invested">Sort by Investment</option>
              <option value="returns">Sort by Returns</option>
              <option value="roi">Sort by ROI</option>
            </select>
          </div>

          <button
            onClick={loadTopInvestors}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <ArrowPathIcon className="h-4 w-4" />
            Refresh
          </button>
        </div>

        {/* Top 3 Podium */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {investors.slice(0, 3).map((investor, index) => (
              <div
                key={investor.id}
                className={`bg-white rounded-lg shadow-lg border-2 p-6 text-center ${
                  index === 0 ? 'border-yellow-400 transform scale-105' : 
                  index === 1 ? 'border-gray-400' : 'border-orange-400'
                }`}
              >
                <div className="text-4xl mb-2">{getBadgeIcon(investor.rank)}</div>
                <div className="text-2xl font-bold text-gray-900 mb-1">#{investor.rank}</div>
                <div className="text-lg font-semibold text-gray-800 mb-2">{investor.name}</div>
                <div className="text-sm text-gray-600 mb-3">{investor.email}</div>
                
                <div className="space-y-2">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-sm text-gray-600">Total Invested</div>
                    <div className="text-lg font-bold text-blue-600">{formatCurrency(investor.totalInvested)}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-sm text-gray-600">Total Returns</div>
                    <div className="text-lg font-bold text-green-600">{formatCurrency(investor.totalReturns)}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-sm text-gray-600">ROI</div>
                    <div className="text-lg font-bold text-purple-600">{investor.roi}%</div>
                  </div>
                </div>

                <div className="mt-4">
                  <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getBadgeColor(investor.badge)}`}>
                    {investor.badge.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Full Leaderboard Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">📊 Complete Leaderboard</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Investor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Invested</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Returns</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ROI</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active Plans</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Level</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Badge</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {investors.map((investor) => (
                  <tr key={investor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-2xl mr-2">{getBadgeIcon(investor.rank)}</span>
                        <span className="text-lg font-bold text-gray-900">#{investor.rank}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                            <UserIcon className="h-6 w-6 text-white" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{investor.name}</div>
                          <div className="text-sm text-gray-500 flex items-center gap-2">
                            <EnvelopeIcon className="h-3 w-3" />
                            {investor.email}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-2">
                            <PhoneIcon className="h-3 w-3" />
                            {investor.phone}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-blue-600">{formatCurrency(investor.totalInvested)}</div>
                      <div className="text-xs text-gray-500">Since {new Date(investor.joinDate).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-green-600">{formatCurrency(investor.totalReturns)}</div>
                      <div className="text-xs text-gray-500">Profit earned</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm font-semibold text-purple-600">{investor.roi}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{investor.activeInvestments} plans</div>
                      <div className="text-xs text-gray-500">
                        {investor.preferredPlans.slice(0, 2).join(', ')}
                        {investor.preferredPlans.length > 2 && '...'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${getRiskColor(investor.riskLevel)}`}>
                        {investor.riskLevel.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getBadgeColor(investor.badge)}`}>
                        {investor.badge.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900">
                        <EyeIcon className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <TrophyIcon className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{investors.length}</div>
            <div className="text-sm text-gray-600">Top Investors</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <CurrencyDollarIcon className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(investors.reduce((sum, inv) => sum + inv.totalInvested, 0))}
            </div>
            <div className="text-sm text-gray-600">Total Invested</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <ArrowTrendingUpIcon className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(investors.reduce((sum, inv) => sum + inv.totalReturns, 0))}
            </div>
            <div className="text-sm text-gray-600">Total Returns</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <StarIcon className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {(investors.reduce((sum, inv) => sum + inv.roi, 0) / investors.length).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Average ROI</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopInvestorsPage;
