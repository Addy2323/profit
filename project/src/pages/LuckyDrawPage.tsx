import React, { useState } from 'react';
import { ArrowLeft, Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LuckyDrawPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [isSpinning, setIsSpinning] = useState(false);
  const [lastSpinDate, setLastSpinDate] = useState<string | null>(
    localStorage.getItem(`lastSpin_${user?.id}`)
  );

  const prizes = [
    { name: 'Balance Bonus', amount: 1000, probability: 0.3 },
    { name: 'Small Bonus', amount: 500, probability: 0.4 },
    { name: 'Jackpot!', amount: 5000, probability: 0.05 },
    { name: 'Better Luck', amount: 0, probability: 0.25 },
  ];

  const canSpin = () => {
    if (!lastSpinDate) return true;
    const today = new Date().toDateString();
    return lastSpinDate !== today;
  };

  const handleSpin = () => {
    if (!canSpin()) {
      alert('You can only spin once per day!');
      return;
    }

    setIsSpinning(true);
    
    setTimeout(() => {
      const random = Math.random();
      let cumulativeProbability = 0;
      let selectedPrize = prizes[prizes.length - 1];

      for (const prize of prizes) {
        cumulativeProbability += prize.probability;
        if (random <= cumulativeProbability) {
          selectedPrize = prize;
          break;
        }
      }

      if (selectedPrize.amount > 0) {
        updateUser({ balance: (user?.balance || 0) + selectedPrize.amount });
        alert(`Congratulations! You won TZS ${selectedPrize.amount}!`);
      } else {
        alert('Better luck next time!');
      }

      const today = new Date().toDateString();
      setLastSpinDate(today);
      localStorage.setItem(`lastSpin_${user?.id}`, today);
      setIsSpinning(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-pink-900">
      {/* Header */}
      <div className="bg-black/20 px-4 py-4 flex items-center">
        <button onClick={() => navigate(-1)} className="mr-4">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-lg font-semibold text-white">Lucky Draw</h1>
      </div>

      {/* Magical Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute top-60 left-1/3 w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-40 right-10 w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
      </div>

      <div className="relative z-10 p-4">
        {/* Lucky Draw Wheel */}
        <div className="text-center py-12">
          <div className={`w-32 h-32 mx-auto mb-8 ${isSpinning ? 'animate-spin' : ''}`}>
            <div className="w-full h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Gift className="w-16 h-16 text-white" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-4">Daily Lucky Draw</h2>
          <p className="text-gray-300 mb-8">
            Spin once daily for a chance to win amazing prizes!
          </p>

          <button
            onClick={handleSpin}
            disabled={!canSpin() || isSpinning}
            className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all ${
              canSpin() && !isSpinning
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isSpinning ? 'Spinning...' : canSpin() ? 'SPIN NOW' : 'Come back tomorrow'}
          </button>

          {!canSpin() && (
            <p className="text-yellow-400 mt-4 text-sm">
              You've already spun today. Come back tomorrow!
            </p>
          )}
        </div>

        {/* Prize List */}
        <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 mt-8">
          <h3 className="text-white font-semibold mb-4">Possible Prizes</h3>
          <div className="space-y-3">
            {prizes.map((prize, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-300">{prize.name}</span>
                <span className="text-yellow-400 font-semibold">
                  {prize.amount > 0 ? `TZS ${prize.amount}` : '🍀'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LuckyDrawPage;