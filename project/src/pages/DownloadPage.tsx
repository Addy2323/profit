import React from 'react';
import PageHeader from '../components/PageHeader';

const DownloadPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <PageHeader title="App Download" />
      <div className="p-4">
        <p className="mt-4">Our app is coming soon! Check back later for download links.</p>
      </div>
    </div>
  );
};

export default DownloadPage;
