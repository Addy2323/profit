import React, { useMemo, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------
interface UserLite {
  id: string;
  phone: string;
  referralCode: string;
  referredBy?: string;
  createdAt: string | Date;
}

interface TeamEntry extends UserLite {
  commission: number; // calculated commission (TZS)
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------
const TeamPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'B' | 'C' | 'D'>('B');

  // Fetch all stored users once. Convert to the lightweight structure we need.
  const allUsers: UserLite[] = useMemo(() => {
    const raw = JSON.parse(localStorage.getItem('profitnet_users') || '[]');
    return raw.map((u: any) => ({
      id: u.id,
      phone: u.phone,
      referralCode: u.referralCode,
      referredBy: u.referredBy,
      createdAt: u.createdAt,
    }));
  }, []);

  // Helper to format date like "03-06 11:17"
  const fmt = (d: Date) =>
    `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(
      d.getHours(),
    ).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;

  // ---------------------------------------------------------------------------
  // Compute team data: levels B, C, D with commissions
  // ---------------------------------------------------------------------------
  const teamData = useMemo((): Record<'B' | 'C' | 'D', TeamEntry[]> => {
    if (!user) return { B: [], C: [], D: [] };

    const calcCommission = (member: UserLite, rate: number): TeamEntry => {
      // Commission is paid as a percentage of completed recharge amounts for downline member
      const txKey = `transactions_${member.id}`;
      const txns: any[] = JSON.parse(localStorage.getItem(txKey) || '[]');
      const totalRecharge = txns
        .filter(t => t.type === 'recharge' && t.status === 'completed')
        .reduce((sum, t) => sum + (t.amount || 0), 0);
      return {
        ...member,
        commission: Math.round(totalRecharge * rate * 100) / 100, // round to 2dp
      };
    };

    // Level B – users directly referred by current user
    const levelB = allUsers.filter(u => u.referredBy === user.referralCode);

    // Level C – users referred by level B
    const levelC = allUsers.filter(u => levelB.some(b => b.referralCode === u.referredBy));

    // Level D – users referred by level C
    const levelD = allUsers.filter(u => levelC.some(c => c.referralCode === u.referredBy));

    return {
      B: levelB.map(u => calcCommission(u, 0.35)), // 35% of recharge amount
      C: levelC.map(u => calcCommission(u, 0.02)), // 2%
      D: levelD.map(u => calcCommission(u, 0.01)), // 1%
    };
  }, [user, allUsers]);

  if (!user) return null;

  const tabs = [
    { key: 'B' as const, label: `B(${teamData.B.length})` },
    { key: 'C' as const, label: `C(${teamData.C.length})` },
    { key: 'D' as const, label: `D(${teamData.D.length})` },
  ];

  const list = teamData[activeTab];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-pink-900">
      {/* Header */}
      <div className="bg-black/20 px-4 py-4 flex items-center">
        <button onClick={() => navigate(-1)} className="mr-4">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-lg font-semibold text-white">Invite income</h1>
      </div>

      {/* Tabs */}
      <div className="flex bg-black/40 mx-4 mt-4 rounded-lg overflow-hidden">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              activeTab === t.key ? 'bg-white text-black' : 'text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="px-4 pt-4 space-y-4 pb-24">
        {list.map(u => (
          <div
            key={u.id}
            className="bg-black/20 backdrop-blur-sm rounded-lg p-4 flex justify-between items-center"
          >
            <div>
              <p className="text-white font-semibold text-sm">{u.phone}</p>
              <p className="text-gray-400 text-xs mt-1">Time {fmt(new Date(u.createdAt))}</p>
            </div>
            <p className="text-red-500 font-bold text-sm">+{u.commission.toLocaleString()} TZS</p>
          </div>
        ))}

        {list.length === 0 && <p className="text-center text-gray-300 mt-20">No records</p>}
      </div>
    </div>
  );
};

export default TeamPage;
