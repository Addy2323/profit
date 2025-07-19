import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface PageHeaderProps {
  title: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center p-4 bg-gray-800 text-white sticky top-0 z-10">
      <button onClick={() => navigate(-1)} className="mr-4">
        <ArrowLeft className="w-6 h-6" />
      </button>
      <h1 className="text-xl font-semibold">{title}</h1>
    </div>
  );
};

export default PageHeader;
