import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const Dashboard: React.FC = () => {
  // Aggregate stats from localStorage
  const stats = useMemo(() => {
    const users = JSON.parse(localStorage.getItem('profitnet_users') || '[]');

    const totalUsers = users.length;
    const totalBalance = users.reduce((sum: number, u: any) => sum + (u.balance || 0), 0);

    const allTransactions: any[] = users.flatMap((u: any) =>
      JSON.parse(localStorage.getItem(`transactions_${u.id}`) || '[]'),
    );
    const totalRecharges = allTransactions
      .filter(t => t.type === 'recharge' && t.status === 'completed')
      .reduce((sum, t) => sum + (t.amount || 0), 0);
    const totalWithdrawals = allTransactions
      .filter(t => t.type === 'withdrawal' && t.status === 'completed')
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    return { totalUsers, totalBalance, totalRecharges, totalWithdrawals };
  }, []);

    // chart data for last 14 days
  const labels = Array.from({length:14}).map((_,i)=>{
    const d=new Date();d.setDate(d.getDate()-13+i);
    return d.toLocaleDateString();
  });

  const dailyUsers = useMemo(()=>{
    const users = JSON.parse(localStorage.getItem('profitnet_users') || '[]');
    return labels.map(l=>users.filter((u:any)=>new Date(u.createdAt).toLocaleDateString()===l).length);
  },[labels]);
  const dailyTx = useMemo(()=>{
    const users=JSON.parse(localStorage.getItem('profitnet_users')||'[]');
    const allTx=users.flatMap((u:any)=>JSON.parse(localStorage.getItem(`transactions_${u.id}`)||'[]'));
    const recharge=labels.map(l=>allTx.filter((t:any)=>t.type==='recharge' && t.status==='completed' && new Date(t.createdAt).toLocaleDateString()===l).reduce((s:any,t:any)=>s+t.amount,0));
    const withdrawal=labels.map(l=>allTx.filter((t:any)=>t.type==='withdrawal' && t.status==='completed' && new Date(t.createdAt).toLocaleDateString()===l).reduce((s:any,t:any)=>s+t.amount,0));
    return {recharge,withdrawal};
  },[labels]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Users" value={stats.totalUsers.toLocaleString()} />
        <StatCard title="Wallet Balance" value={stats.totalBalance.toLocaleString()} />
        <StatCard title="Total Recharges" value={stats.totalRecharges.toLocaleString()} />
        <StatCard title="Total Withdrawals" value={stats.totalWithdrawals.toLocaleString()} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-sm font-semibold mb-2">Daily Recharges (TZS)</h3>
          <Line data={{labels,datasets:[{label:'Recharge',data:dailyTx.recharge,backgroundColor:'#3b82f6',borderColor:'#3b82f6',fill:false}]}} options={{plugins:{legend:{display:false}},scales:{y:{beginAtZero:true}}}} />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-sm font-semibold mb-2">Daily Withdrawals (TZS)</h3>
          <Line data={{labels,datasets:[{label:'Withdrawal',data:dailyTx.withdrawal,backgroundColor:'#ef4444',borderColor:'#ef4444',fill:false}]}} options={{plugins:{legend:{display:false}},scales:{y:{beginAtZero:true}}}} />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-sm font-semibold mb-2">New Users</h3>
          <Line data={{labels,datasets:[{label:'Users',data:dailyUsers,backgroundColor:'#10b981',borderColor:'#10b981',fill:false}]}} options={{plugins:{legend:{display:false}},scales:{y:{beginAtZero:true}}}} />
        </div>
      </div>
    </div>
  );
};

interface StatProps {
  title: string;
  value: string | number;
}
const StatCard: React.FC<StatProps> = ({ title, value }) => (
  <div className="bg-white rounded shadow p-4">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-xl font-semibold mt-2">{value}</p>
  </div>
);

export default Dashboard;
