import React from 'react';
import PageHeader from '../components/PageHeader';

const TransactionHistoryPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <PageHeader title="Transaction History" />
      <div className="p-4">
        <p className="mt-4">Your transaction history will be displayed here.</p>
      </div>
    </div>
  );
};

export default TransactionHistoryPage;
