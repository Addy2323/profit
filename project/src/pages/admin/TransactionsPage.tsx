import React, { useState } from 'react';
import { exportCsv } from '../../utils/csv';

const PAGE_SIZE = 10;

const TransactionsPage: React.FC = () => {
  const [transactions,setTransactions]=useState<any[]>(()=>{
    const users = JSON.parse(localStorage.getItem('profitnet_users') || '[]');
    return users.flatMap((u: any) =>
      JSON.parse(localStorage.getItem(`transactions_${u.id}`) || '[]').map((t: any) => ({
        ...t,
        userId: u.id,
        userEmail: u.email,
      })),
    );
  });
  const [search,setSearch]=useState('');
  const [statusFilter,setStatusFilter]=useState<'all'|'pending'|'completed'|'rejected'>('all');
  const types: Array<'all' | 'purchase' | 'recharge' | 'withdrawal'> = ['all','purchase','recharge','withdrawal'];
  const [typeFilter,setTypeFilter]=useState<'all'|'purchase'|'recharge'|'withdrawal'>('all');
  const [page,setPage]=useState(1);

  const updateTx=(tx:any,newStatus:string)=>{
    const updated=transactions.map(t=>t.id===tx.id?{...t,status:newStatus}:t);
    setTransactions(updated);

    // If rejecting a withdrawal, refund the amount to the user's balance
    if(newStatus==='rejected' && tx.type==='withdrawal'){
        const users = JSON.parse(localStorage.getItem('profitnet_users') || '[]');
        const idx = users.findIndex((u:any)=>u.id===tx.userId);
        if(idx!==-1){
          users[idx].balance = (users[idx].balance || 0) + tx.amount;
          localStorage.setItem('profitnet_users',JSON.stringify(users));
          const currentStr = localStorage.getItem('profitnet_user');
          if(currentStr){
            try{
              const current = JSON.parse(currentStr);
              if(current.id===tx.userId){
                const updatedCurrent = {...current,balance:users[idx].balance};
                localStorage.setItem('profitnet_user',JSON.stringify(updatedCurrent));
              }
            }catch(e){ console.error(e); }
          }
        }
    }


    // persist to specific user list
    const listForUser=updated.filter(t=>t.userId===tx.userId).map(({userId,userEmail,...rest})=>rest);
    localStorage.setItem(`transactions_${tx.userId}`,JSON.stringify(listForUser));
  };

  const filtered=transactions.filter(t=>{
    if(statusFilter!=='all' && t.status!==statusFilter) return false;
    if(typeFilter!=='all' && t.type!==typeFilter) return false;
    if(search && ![t.userEmail,t.type,String(t.amount)].some((f:string)=>f.toLowerCase().includes(search.toLowerCase()))) return false;
    return true;
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
        <button onClick={()=>exportCsv(filtered,'transactions.csv')} className="px-3 py-1 bg-indigo-600 text-white rounded text-sm">Export CSV</button>
        <h1 className="text-xl font-bold">Transactions</h1>
        <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} placeholder="Search..." className="px-2 py-1 text-sm border rounded" />
        <select value={statusFilter} onChange={e=>{setStatusFilter(e.target.value as any);setPage(1);}} className="px-2 py-1 text-sm border rounded">
          <option value="all">All Status</option>
          <option value="pending">pending</option>
          <option value="completed">completed</option>
          <option value="rejected">rejected</option>
        </select>
        {/* tabs */}
        <div className="flex space-x-1">
          {types.map(t=> (
            <button key={t} onClick={()=>{setTypeFilter(t);setPage(1);}} className={`px-3 py-1 text-sm rounded ${typeFilter===t?'bg-blue-600 text-white':'bg-gray-200'}`}>{t.charAt(0).toUpperCase()+t.slice(1)}</button>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">User</th>
              <th className="px-4 py-2 text-left">Type</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered
              .slice((page-1)*PAGE_SIZE,page*PAGE_SIZE)
              .map((t:any)=> (
              <tr key={t.id} className="border-t">
                <td className="px-4 py-2">{t.userEmail}</td>
                <td className="px-4 py-2">{t.type}</td>
                <td className="px-4 py-2 text-center">{t.amount.toLocaleString()}</td>
                <td className="px-4 py-2 text-center">{t.status}</td>
                <td className="px-4 py-2 text-center">{new Date(t.createdAt).toLocaleString()}</td>
                <td className="px-4 py-2 text-center space-x-1">
                  {t.status!=='completed' && (t.type==='recharge'||t.type==='withdrawal') && (
                    <>
                      <button onClick={()=>updateTx(t,'completed')} className="px-2 py-1 bg-green-600 text-xs text-white rounded">Approve</button>
                      <button onClick={()=>updateTx(t,'rejected')} className="px-2 py-1 bg-red-600 text-xs text-white rounded">Reject</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between items-center p-2">
          <button disabled={page===1} onClick={()=>setPage(p=>p-1)} className="px-2 py-1 text-sm bg-gray-200 disabled:opacity-50 rounded">Prev</button>
          <span className="text-sm">Page {page}</span>
          <button disabled={page*PAGE_SIZE>=filtered.length} onClick={()=>setPage(p=>p+1)} className="px-2 py-1 text-sm bg-gray-200 disabled:opacity-50 rounded">Next</button>
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;
