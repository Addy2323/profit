import React, { useState } from 'react';
import UserDrawer from '../../components/admin/UserDrawer';
import { exportCsv } from '../../utils/csv';
import { useAuth } from '../../contexts/AuthContext';

const PAGE_SIZE = 10;

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>(() => JSON.parse(localStorage.getItem('profitnet_users') || '[]'));

    const [search,setSearch]=useState('');
  const [page,setPage]=useState(1);

  const [selected,setSelected]=useState<any|null>(null);

  const refresh = (list: any[]) => {
    setUsers(list);
    localStorage.setItem('profitnet_users', JSON.stringify(list));
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this user?')) return;
    const updated = users.filter(u => u.id !== id);
    refresh(updated);
    // also clear their purchases & transactions
    localStorage.removeItem(`purchases_${id}`);
    localStorage.removeItem(`transactions_${id}`);
  };

  const handleBalance = (id: string, newVal?: number) => {
    const u = users.find(u => u.id === id);
    if (!u) return;
    const val = newVal !== undefined ? newVal : prompt('New balance', u.balance as any);
    if (val === null) return;
    const updated = users.map(user => (user.id === id ? { ...user, balance: Number(val) } : user));
    refresh(updated);
  };

  const { user: current } = useAuth();

  const filtered = users.filter(u =>
    [u.name, u.email, u.phone].some((f: string) => f.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
        <button onClick={() => exportCsv(filtered, 'users.csv')} className="px-3 py-1 bg-indigo-600 text-white rounded text-sm">Export CSV</button>
        <h1 className="text-xl font-bold">Users</h1>
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search..." className="px-2 py-1 text-sm border rounded" />
      </div>
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Balance</th>
              <th className="px-4 py-2">Created</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users
              .filter(u=>
                [u.name,u.email,u.phone].some((f:string)=>f.toLowerCase().includes(search.toLowerCase()))
              )
              .slice((page-1)*PAGE_SIZE,page*PAGE_SIZE)
              .map((u:any)=> (
              <tr key={u.id} className="border-t hover:bg-gray-50 cursor-pointer" onClick={()=>setSelected(u)}>
                <td className="px-4 py-2">{u.name}</td>
                <td className="px-4 py-2">{u.email}</td>
                <td className="px-4 py-2 text-center">{u.phone}</td>
                <td className="px-4 py-2 text-center">{u.role}</td>
                <td className="px-4 py-2 text-center">{u.balance.toLocaleString()}</td>
                <td className="px-4 py-2 text-center">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-2 text-center space-x-1">
                  <button onClick={e=>{e.stopPropagation();handleBalance(u.id);}} className="px-2 py-1 text-xs bg-green-600 text-white rounded">Balance</button>
                  <button onClick={()=>handleDelete(u.id)} className="px-2 py-1 text-xs bg-red-600 text-white rounded">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
          {/* pagination */}
          <div className="flex justify-between items-center p-2">
            <button disabled={page===1} onClick={()=>setPage(p=>p-1)} className="px-2 py-1 text-sm bg-gray-200 disabled:opacity-50 rounded">Prev</button>
            <span className="text-sm">Page {page}</span>
            <button
              disabled={page*PAGE_SIZE>=users.filter(u=>[u.name,u.email,u.phone].some((f:string)=>f.toLowerCase().includes(search.toLowerCase()))).length}
              onClick={()=>setPage(p=>p+1)}
              className="px-2 py-1 text-sm bg-gray-200 disabled:opacity-50 rounded"
            >Next</button>
          </div>
      </div>
      {selected && (
        <UserDrawer
          user={selected}
          onClose={()=>setSelected(null)}
          onBalanceUpdate={(bal)=>handleBalance(selected.id,bal)}
        />
      )}
      {current?.role !== 'admin' && (
        <p className="mt-4 text-red-500">Only admin can edit user data.</p>
      )}
    </div>
  );
};

export default UsersPage;
