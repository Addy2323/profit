import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface Purchase {
  id: string;
  userId: string;
  productId: string;
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
  };
  purchaseDate: string | Date;
  expiresAt: string | Date;
  isActive: boolean;
}

const ProjectsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState<Purchase[]>([]);

  const removePurchase = (purchaseId: string) => {
    if (!user) return;
    const updated = purchases.filter(p => p.id !== purchaseId);
    setPurchases(updated);
    localStorage.setItem(`purchases_${user.id}`, JSON.stringify(updated));
  };

  const clearAllPurchases = () => {
    if (!user) return;
    localStorage.removeItem(`purchases_${user.id}`);
    setPurchases([]);
  }

  // Load purchases from localStorage whenever the component mounts
  useEffect(() => {
    if (!user) return;
    const stored = localStorage.getItem(`purchases_${user.id}`) || '[]';
    const parsed: Purchase[] = JSON.parse(stored);

    // Sort purchases by most recent first
    parsed.sort((a, b) => {
      const da = new Date(a.purchaseDate).getTime();
      const db = new Date(b.purchaseDate).getTime();
      return db - da;
    });

    setPurchases(parsed);
  }, [user]);

  const calculateRemainingDays = (expiresAt: string | Date) => {
    const expiry = new Date(expiresAt).getTime();
    const now = Date.now();
    const diffMs = expiry - now;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-pink-900">
      {/* Header */}
      <div className="bg-black/20 px-4 py-4 flex items-center">
        <button onClick={() => navigate(-1)} className="mr-4">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-lg font-semibold text-white flex-1">Projects</h1>
        {purchases.length > 0 && (
          <button
            onClick={clearAllPurchases}
            className="text-sm text-red-400 hover:text-red-300"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Magic background dots (same style as other pages) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute top-60 left-1/3 w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-40 right-10 w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
      </div>

      {/* Empty state */}
      {purchases.length === 0 && (
        <div className="flex items-center justify-center h-full pt-32 text-gray-300">
          You have no projects yet.
        </div>
      )}

      {/* Purchase list */}
      <div className="px-4 space-y-4 pt-4 pb-20">
        {purchases.map((purchase) => {
          const remaining = calculateRemainingDays(purchase.expiresAt);
          return (
            <div key={purchase.id} className="bg-black/20 backdrop-blur-sm rounded-xl p-4 relative">
              {/* remove icon */}
              <button
                onClick={() => removePurchase(purchase.id)}
                className="absolute top-2 right-2 text-red-400 hover:text-red-300"
                aria-label="Remove"
              >
                ✕
              </button>
              <div className="flex items-center space-x-4">
                <img
                  src={purchase.product.image}
                  alt={purchase.product.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-white font-semibold mb-1">
                    {purchase.product.name}
                  </h3>
                  <p className="text-gray-300 text-xs mb-1 whitespace-pre-line">
                    {purchase.product.description}
                  </p>
                  <p className="text-yellow-400 text-sm font-medium">
                    Remaining Days: {remaining}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectsPage;
