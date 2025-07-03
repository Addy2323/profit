import React, { useState } from 'react';
import { Gift } from 'lucide-react';

interface InvitationCardProps {
  referralCode: string;
}

const InvitationCard: React.FC<InvitationCardProps> = ({ referralCode }) => {
  const [copied, setCopied] = useState(false);
  const invitationLink = `https://profitnet.tz/p/${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(invitationLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 rounded-xl p-6 relative overflow-hidden mb-6">
      <div className="absolute top-4 right-4 text-white">
        <Gift className="w-6 h-6" />
      </div>
      
      <div className="mb-6">
        <h3 className="text-white text-lg font-medium mb-2">Invitation link</h3>
        <div className="flex items-center bg-white/20 rounded-lg p-2 pr-0 overflow-hidden">
          <p className="text-white/90 text-sm truncate flex-1">{invitationLink}</p>
          <button 
            onClick={handleCopy}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-l-lg transition-colors flex items-center"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
      
      <div>
        <h4 className="text-white font-medium mb-1">Invitation code</h4>
        <p className="text-white/80">{referralCode}</p>
      </div>
    </div>
  );
};

export default InvitationCard;
