import React, { useState } from 'react';
import { ArrowLeft, Copy, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RechargePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [amount, setAmount] = useState('1000.00');
  const [selectedNetwork, setSelectedNetwork] = useState('vodacom');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [transactionMessage, setTransactionMessage] = useState('');
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);

  const networks = [
    { id: 'vodacom', name: 'Vodacom', number: '+255765123456' },
    { id: 'tigo', name: 'Tigo', number: '+255654321098' },
    { id: 'airtel', name: 'Airtel', number: '+255743210987' },
    { id: 'halotel', name: 'Halotel', number: '+255623456789' },
  ];

  const selectedNetworkData = networks.find(n => n.id === selectedNetwork);

  const handlePayment = () => {
    setShowPaymentModal(true);
  };

  const handleUpload = () => {
    if (transactionMessage.trim() || uploadedImage) {
      // Simulate successful recharge
      const rechargeAmount = parseFloat(amount);
      updateUser({ balance: (user?.balance || 0) + rechargeAmount });
      
      // Add transaction to history
      const transaction = {
        id: Date.now().toString(),
        userId: user?.id || '',
        type: 'recharge' as const,
        amount: rechargeAmount,
        description: `Mobile money recharge via ${selectedNetworkData?.name}`,
        status: 'completed' as const,
        createdAt: new Date(),
      };
      
      const existingTransactions = JSON.parse(localStorage.getItem(`transactions_${user?.id}`) || '[]');
      existingTransactions.unshift(transaction);
      localStorage.setItem(`transactions_${user?.id}`, JSON.stringify(existingTransactions));
      
      setShowPaymentModal(false);
      navigate('/dashboard');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedImage(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 px-4 py-4 flex items-center">
        <button onClick={() => navigate(-1)} className="mr-4">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-lg font-semibold">Recharge</h1>
      </div>

      <div className="p-4">
        {/* Amount Display */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 mb-6">
          <div className="text-center">
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
              className="w-full bg-transparent text-3xl font-bold text-white mb-2 text-center focus:outline-none"
            />
            <div className="text-orange-100">TSh</div>
          </div>
        </div>

        {/* Network Selection */}
        <div className="mb-6">
          <h3 className="text-white font-semibold mb-3">Select Network</h3>
          <div className="grid grid-cols-2 gap-3">
            {networks.map((network) => (
              <button
                key={network.id}
                onClick={() => setSelectedNetwork(network.id)}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  selectedNetwork === network.id
                    ? 'border-orange-500 bg-orange-500/20'
                    : 'border-gray-600 bg-gray-800'
                }`}
              >
                <div className="text-white font-medium">{network.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Payment Instructions */}
        <div className="bg-gray-800 rounded-xl p-4 mb-6">
          <h3 className="text-white font-semibold mb-3">Payment Instructions</h3>
          <div className="space-y-2 text-sm text-gray-300">
            <p>1. Minimum recharge amount: 30,000 TZS</p>
            <p>2. When making a payment, please check the payment information carefully to avoid payment errors.</p>
            <p>3. Copy and recharge, please use a new number in the payment account, and do not repeat the number.</p>
            <p>4. After recharging, please wait patiently for 10-30 minutes.</p>
            <p>5. If you still haven't received it after 30 minutes, please contact customer service.</p>
          </div>
        </div>

        {/* Payment Button */}
        <button
          onClick={handlePayment}
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-xl font-semibold text-lg"
        >
          Payment
        </button>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Upload</h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-300 mb-2">
                  Please provide the following information to help us confirm your order:
                </p>
                <p className="text-sm text-gray-300 mb-2">
                  1. Enter the transaction code in your mobile phone text message.
                </p>
                <p className="text-sm text-gray-300 mb-4">
                  2. Upload a screenshot of the successful payment and wait patiently.
                </p>
              </div>

              <div className="bg-gray-700 rounded-lg p-3">
                <div className="text-sm text-gray-300">
                  <div>Order ID: 20250317175255817266</div>
                  <div>Amount: TZS{amount}</div>
                  <div>Time: {new Date().toLocaleString()}</div>
                </div>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Enter your SMS transaction code"
                  value={transactionMessage}
                  onChange={(e) => setTransactionMessage(e.target.value)}
                  className="w-full bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <div className="w-16 h-16 bg-gray-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div className="text-gray-400 text-sm">Upload Image</div>
                </label>
              </div>

              <button
                onClick={handleUpload}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-lg font-semibold"
              >
                UPLOAD
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RechargePage;