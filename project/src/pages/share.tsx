import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import InvitationCard from '../components/InvitationCard';
import PageHeader from '../components/PageHeader';

const SharePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <PageHeader title="Invite Friends" />
      <div className="container mx-auto px-4 py-8">
        <div className="px-4 py-6">
          <div className="relative bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-6 overflow-hidden">
            <InvitationCard referralCode={user?.referralCode || ''} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharePage;