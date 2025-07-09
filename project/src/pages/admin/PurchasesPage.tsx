import React, { useMemo, useState } from 'react';
import { exportCsv } from '../../utils/csv';

const PAGE_SIZE = 10;

const PurchasesPage: React.FC = () => {
  const rawPurchases = useMemo(() => {
    const users = JSON.parse(localStorage.getItem('profitnet_users') || '[]');
    return users.flatMap((u: any) =>
      JSON.parse(localStorage.getItem(`purchases_${u.id}`) || '[]').map((p: any) => ({
        ...p,
        userEmail: u.email,
      })),
    );
  }, []);

  const [search,setSearch]=useState('');
  const [page,setPage]=useState(1);

  const purchases = rawPurchases.filter(p=>
    [p.userEmail,p.product.name].some((f:string)=>f.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
        <button onClick={()=>exportCsv(purchases,'purchases.csv')} className="px-3 py-1 bg-indigo-600 text-white rounded text-sm">Export CSV</button>
        <h1 className="text-xl font-bold">Purchases</h1>
        <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} placeholder="Search..." className="px-2 py-1 text-sm border rounded" />
      </div>
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">User</th>
              <th className="px-4 py-2 text-left">Product</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Purchase Date</th>
              <th className="px-4 py-2">Expires</th>
            </tr>
          </thead>
          <tbody>
            {purchases
              .slice((page-1)*PAGE_SIZE,page*PAGE_SIZE)
              .map((p:any)=> (
              <tr key={p.id} className="border-t">
                <td className="px-4 py-2">{p.userEmail}</td>
                <td className="px-4 py-2">{p.product.name}</td>
                <td className="px-4 py-2 text-center">{p.product.price.toLocaleString()}</td>
                <td className="px-4 py-2 text-center">{new Date(p.purchaseDate).toLocaleDateString()}</td>
                <td className="px-4 py-2 text-center">{new Date(p.expiresAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between items-center p-2">
          <button disabled={page===1} onClick={()=>setPage(p=>p-1)} className="px-2 py-1 text-sm bg-gray-200 disabled:opacity-50 rounded">Prev</button>
          <span className="text-sm">Page {page}</span>
          <button disabled={page*PAGE_SIZE>=purchases.length} onClick={()=>setPage(p=>p+1)} className="px-2 py-1 text-sm bg-gray-200 disabled:opacity-50 rounded">Next</button>
        </div>
      </div>
    </div>
  );
};

export default PurchasesPage;
