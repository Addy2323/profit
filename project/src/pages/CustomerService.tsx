import React from 'react';
import PageHeader from '../components/PageHeader';

interface CustomerServiceProps {
  group_link: string;
  admin_number: string;
}

const CustomerService: React.FC<CustomerServiceProps> = ({ group_link, admin_number }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <PageHeader title="Customer Service" />
      <div className="p-6">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-4xl mx-auto text-center">
          <h2 className="text-xl font-bold text-white mb-6">Get in Touch</h2>
          <p className="text-gray-400 mb-8">
            Have questions or need support? Reach out to us through our WhatsApp channels.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <a 
              href={group_link}
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md transition-colors duration-300 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 focus:ring-offset-gray-800"
            >
              <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.77 3.05 1.18 4.79 1.18h.01c5.46 0 9.91-4.45 9.91-9.91s-4.45-9.91-9.91-9.91zM17.43 14.38c-.2-.1-.68-.33-1.16-.55-.48-.22-.83-.33-.94-.33-.11 0-.28.05-.42.33-.14.28-.44.83-.54 1-.1.17-.2.18-.38.13-.18-.05-1.33-.48-2.53-1.55-.94-.83-1.58-1.86-1.76-2.18-.18-.32-.02-.48.08-.63.09-.13.2-.22.28-.33.08-.11.12-.18.18-.3.06-.12.03-.22-.02-.33-.05-.11-.94-2.25-1.28-3.07-.34-.82-.68-.7-.94-.7-.25 0-.53-.05-.7-.05-.18 0-.45.08-.68.33-.23.25-.88.85-1.08 2.05-.2 1.2.54 2.83 1.23 3.53.68.7 2.15 2.95 5.23 4.13 2.08.78 3.01.83 3.53.83.52 0 1.38-.22 1.58-.93.2-.7.2-1.28.14-1.43-.06-.15-.2-.23-.4-.33z"/></svg>
              Join WhatsApp Group
            </a>
            <a 
              href={`https://wa.me/${admin_number}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md transition-colors duration-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-800"
            >
              <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
              Contact Admin
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerService;
