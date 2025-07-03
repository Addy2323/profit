import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('ordinary');

  const products = [
    {
      id: '1',
      name: 'Free Products',
      description: 'Each Return: 6000.00\nCycling: 1Times\nIn stock: 1022',
      price: 0,
      originalPrice: 6000,
      image: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=200',
      category: 'ordinary'
    },
    {
      id: '2',
      name: 'Nuts',
      description: 'Each Return: 1000.00\nCycling: 180Times',
      price: 10000,
      image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=200',
      category: 'ordinary'
    },
    {
      id: '3',
      name: 'Electric toothbrush',
      description: 'Each Return: 3000.00',
      price: 25000,
      image: 'https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=200',
      category: 'ordinary'
    },
    {
      id: '4',
      name: 'Premium Gaming Bundle',
      description: 'Each Return: 15000.00\nCycling: 90Days\nVIP Access',
      price: 50000,
      image: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=200',
      category: 'vip'
    }
  ];

  const filteredProducts = products.filter(p => p.category === selectedCategory);

  const handlePurchase = (product: any) => {
    if ((user?.balance || 0) >= product.price) {
      updateUser({ balance: (user?.balance || 0) - product.price });
      
      // Add purchase to history
      const purchase = {
        id: Date.now().toString(),
        userId: user?.id || '',
        productId: product.id,
        product: product,
        purchaseDate: new Date(),
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
        isActive: true,
      };
      
      const existingPurchases = JSON.parse(localStorage.getItem(`purchases_${user?.id}`) || '[]');
      existingPurchases.unshift(purchase);
      localStorage.setItem(`purchases_${user?.id}`, JSON.stringify(existingPurchases));
      
      // Add transaction
      const transaction = {
        id: Date.now().toString(),
        userId: user?.id || '',
        type: 'purchase' as const,
        amount: -product.price,
        description: `Purchased ${product.name}`,
        status: 'completed' as const,
        createdAt: new Date(),
      };
      
      const existingTransactions = JSON.parse(localStorage.getItem(`transactions_${user?.id}`) || '[]');
      existingTransactions.unshift(transaction);
      localStorage.setItem(`transactions_${user?.id}`, JSON.stringify(existingTransactions));
      
      alert('Product purchased successfully!');
    } else {
      alert('Insufficient balance. Please recharge your wallet.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-pink-900">
      {/* Header */}
      <div className="bg-black/20 px-4 py-4 flex items-center">
        <button onClick={() => navigate(-1)} className="mr-4">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-lg font-semibold text-white">Products</h1>
      </div>

      {/* Magical Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute top-60 left-1/3 w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-40 right-10 w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
      </div>

      {/* Unicorn Illustration Area */}
      <div className="relative h-48 flex items-center justify-center">
        <div className="text-6xl">🦄</div>
      </div>

      {/* Category Tabs */}
      <div className="px-4 mb-6">
        <div className="flex bg-black/20 rounded-lg p-1">
          <button
            onClick={() => setSelectedCategory('ordinary')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              selectedCategory === 'ordinary'
                ? 'bg-white text-black'
                : 'text-white'
            }`}
          >
            Ordinary
          </button>
          <button
            onClick={() => setSelectedCategory('vip')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              selectedCategory === 'vip'
                ? 'bg-white text-black'
                : 'text-white'
            }`}
          >
            VIP
          </button>
        </div>
      </div>

      {/* Products List */}
      <div className="px-4 space-y-4">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-black/20 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center space-x-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-1">{product.name}</h3>
                <p className="text-gray-300 text-xs whitespace-pre-line">
                  {product.description}
                </p>
                <div className="mt-2">
                  <span className="text-red-400 font-bold">
                    TZS{product.price.toLocaleString()}.00
                  </span>
                </div>
              </div>
              <button
                onClick={() => handlePurchase(product)}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-lg font-semibold"
              >
                Buy
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;