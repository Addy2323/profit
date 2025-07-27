import React, { useState } from 'react';
import { ArrowLeft, Copy, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AutoPaymentService } from '../services/AutoPaymentService';
import { showSuccessAlert, showErrorAlert, showInfoAlert } from '../utils/alertUtils';

const RechargePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [amount, setAmount] = useState('1000.00');
  const [selectedNetwork, setSelectedNetwork] = useState('vodacom');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [transactionMessage, setTransactionMessage] = useState('');
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [validationStatus, setValidationStatus] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const paymentNumbers = AutoPaymentService.getPaymentNumbers();

  const selectedPaymentNumber = paymentNumbers.find(n => n.network === selectedNetwork);

  const handlePayment = () => {
    setShowPaymentModal(true);
  };

  const handleUpload = async () => {
    if (!transactionMessage.trim()) {
      setValidationStatus('Please enter your transaction ID');
      showErrorAlert('Please enter your transaction ID to confirm payment.');
      return;
    }

    setIsProcessing(true);
    setValidationStatus('Processing transaction...');

    try {
      const transactionId = transactionMessage.trim();
      const rechargeAmount = parseFloat(amount);

      // Process transaction with AutoPaymentService
      const result = await AutoPaymentService.processTransactionId(
        transactionId,
        rechargeAmount,
        user?.id || '',
        selectedNetwork
      );

      setValidationStatus(result.message);

      if (result.success && result.transaction) {
        // Auto-update user balance
        const balanceUpdated = await AutoPaymentService.updateUserBalance(
          user?.id || '',
          rechargeAmount
        );

        if (balanceUpdated) {
          // Update user context
          updateUser({ 
            balance: (user?.balance || 0) + rechargeAmount
          });

          setValidationStatus('✅ Payment confirmed! Balance updated successfully.');
          showSuccessAlert(`Payment of ${rechargeAmount.toLocaleString()} TZS confirmed successfully! Your balance has been updated.`);
          
          setTimeout(() => {
            setShowPaymentModal(false);
            navigate('/dashboard');
          }, 2000);
        } else {
          setValidationStatus('❌ Error updating balance. Please contact support.');
          showErrorAlert('Error updating your balance. Please contact support for assistance.');
        }
      } else {
        // Transaction validation failed
        showErrorAlert(result.message || 'Transaction validation failed. Please check your transaction ID and try again.');
      }
    } catch (error) {
      setValidationStatus('❌ Error processing transaction. Please try again.');
      showErrorAlert('Error processing your transaction. Please check your internet connection and try again.');
    } finally {
      setIsProcessing(false);
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

        {/* Payment Numbers Selection */}
        <div className="mb-6">
          <h3 className="text-white font-semibold mb-3">Select Payment Number</h3>
          <div className="space-y-3">
            {paymentNumbers.map((paymentNum) => (
              <div
                key={paymentNum.id}
                className={`p-4 rounded-lg border-2 transition-colors cursor-pointer ${
                  selectedNetwork === paymentNum.network
                    ? 'border-orange-500 bg-orange-500/20'
                    : 'border-gray-600 bg-gray-800'
                }`}
                onClick={() => setSelectedNetwork(paymentNum.network)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-medium">{paymentNum.name}</div>
                    <div className="text-orange-400 font-mono text-lg">{paymentNum.number}</div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.clipboard.writeText(paymentNum.number);
                      showSuccessAlert(`${paymentNum.network} number copied to clipboard!`);
                    }}
                    className="p-2 bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors"
                  >
                    <Copy className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Instructions */}
        <div className="bg-gray-800 rounded-xl p-4 mb-6">
          <h3 className="text-white font-semibold mb-3">🔄 Automatic Payment System</h3>
          <div className="space-y-2 text-sm text-gray-300">
            <p>✅ <strong>Step 1:</strong> Select one of the three payment numbers above</p>
            <p>✅ <strong>Step 2:</strong> Copy the number and send money via mobile money</p>
            <p>✅ <strong>Step 3:</strong> Enter your transaction ID below for instant confirmation</p>
            <p>✅ <strong>Step 4:</strong> Your balance will be updated automatically within seconds!</p>
            <div className="mt-3 p-3 bg-green-600/20 rounded-lg">
              <p className="text-green-400 font-medium">💡 New Feature: Automatic balance updates!</p>
              <p className="text-green-300 text-xs">No more waiting - your balance updates instantly after transaction confirmation.</p>
            </div>
          </div>
        </div>

        {/* Validation Status */}
        {validationStatus && (
          <div className={`mt-4 p-3 rounded-lg ${
            validationStatus.includes('success') ? 'bg-green-600/20 text-green-400' : 
            validationStatus.includes('blocked') ? 'bg-red-600/20 text-red-400' : 
            'bg-yellow-600/20 text-yellow-400'
          }`}>
            {validationStatus}
          </div>
        )}

        {/* Payment Button */}
        <button
          onClick={handlePayment}
          disabled={isProcessing || user?.isBlocked}
          className={`w-full py-4 rounded-xl font-semibold text-lg ${
            isProcessing || user?.isBlocked ? 'bg-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
          }`}
        >
          {isProcessing ? 'Processing...' : 'Payment'}
        </button>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">🚀 Instant Payment Confirmation</h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-600/20 rounded-lg p-3">
                <p className="text-blue-400 font-medium mb-2">📱 Payment Instructions:</p>
                <p className="text-sm text-blue-300 mb-1">
                  1. Send TZS {amount} to: <span className="font-mono text-orange-400">{selectedPaymentNumber?.number}</span>
                </p>
                <p className="text-sm text-blue-300 mb-1">
                  2. Copy the transaction ID from your SMS confirmation
                </p>
                <p className="text-sm text-blue-300">
                  3. Paste it below for instant balance update!
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
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  💳 Transaction ID (from SMS)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g., MP240127ABC123 or TG240127XYZ789"
                    value={transactionMessage}
                    onChange={(e) => setTransactionMessage(e.target.value)}
                    className="w-full bg-gray-700 text-white p-3 pr-12 rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none font-mono"
                  />
                  {transactionMessage && (
                    <CheckCircle className="absolute right-3 top-3 w-6 h-6 text-green-400" />
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  💡 Tip: Transaction IDs usually start with MP (Vodacom), TG (Tigo), or AT (Airtel)
                </p>
              </div>

              {/* Validation Status in Modal */}
              {validationStatus && (
                <div className={`p-3 rounded-lg text-sm ${
                  validationStatus.includes('✅') ? 'bg-green-600/20 text-green-400' : 
                  validationStatus.includes('❌') ? 'bg-red-600/20 text-red-400' : 
                  'bg-yellow-600/20 text-yellow-400'
                }`}>
                  {validationStatus}
                </div>
              )}

              <button
                onClick={handleUpload}
                disabled={!transactionMessage.trim() || isProcessing}
                className={`w-full py-3 rounded-lg font-semibold transition-all ${
                  !transactionMessage.trim() || isProcessing
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700'
                }`}
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  '⚡ CONFIRM PAYMENT'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RechargePage;