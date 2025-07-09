import React, { useState } from 'react';
import { exportCsv } from '../../utils/csv';

const PAGE_SIZE = 10;

const ProductsAdminPage: React.FC = () => {
  const [products, setProducts] = useState(() => {
    return JSON.parse(localStorage.getItem('profitnet_products') || '[]');
  });

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const save = (list: any[]) => {
    setProducts(list);
    localStorage.setItem('profitnet_products', JSON.stringify(list));
  };

  const addProduct = () => {
    const name = prompt('Product name');
    if (!name) return;
    const priceStr = prompt('Price (TZS)');
    const cycleDaysStr = prompt('Cycle days');
    if (!priceStr || !cycleDaysStr) return;
    const newProduct = {
      id: Date.now().toString(),
      name,
      price: Number(priceStr),
      cycleDays: Number(cycleDaysStr),
    };
    save([newProduct, ...products]);
  };

  const handleEdit = (id: string) => {
    const prod = products.find((p: any) => p.id === id);
    if (!prod) return;
    const name = prompt('Product name', prod.name);
    if (!name) return;
    const priceStr = prompt('Price (TZS)', prod.price.toString());
    const cycleDaysStr = prompt('Cycle days', prod.cycleDays.toString());
    if (!priceStr || !cycleDaysStr) return;
    const updatedList = products.map((p: any) =>
      p.id === id ? { ...p, name, price: Number(priceStr), cycleDays: Number(cycleDaysStr) } : p,
    );
    save(updatedList);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this product?')) return;
    save(products.filter((p: any) => p.id !== id));
  };


  const filtered=products.filter(p=>[p.name,String(p.price)].some((f:string)=>f.toLowerCase().includes(search.toLowerCase())));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
        <button onClick={()=>exportCsv(filtered,'products.csv')} className="px-3 py-1 bg-indigo-600 text-white rounded text-sm">Export CSV</button>
        <h1 className="text-xl font-bold">Products</h1>
        <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} placeholder="Search..." className="px-2 py-1 text-sm border rounded" />
        <button onClick={addProduct} className="px-3 py-1 bg-blue-600 text-white rounded text-sm">
          Add
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Price</th>
              <th className="px-4 py-2 text-left">Cycle Days</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered
              .slice((page-1)*PAGE_SIZE,page*PAGE_SIZE)
              .map((p: any) => (
              <tr key={p.id} className="border-t">
                <td className="px-4 py-2">{p.name}</td>
                <td className="px-4 py-2">{p.price.toLocaleString()}</td>
                <td className="px-4 py-2">{p.cycleDays}</td>
                <td className="px-4 py-2 text-center space-x-1">
                  <button onClick={()=>handleEdit(p.id)} className="px-2 py-1 text-xs bg-yellow-500 text-white rounded">Edit</button>
                  <button onClick={()=>handleDelete(p.id)} className="px-2 py-1 text-xs bg-red-600 text-white rounded">Delete</button>
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

export default ProductsAdminPage;
