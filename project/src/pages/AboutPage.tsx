import React from 'react';
import PageHeader from '../components/PageHeader';

const products = [
  { price: '10,000 TZS', interest: '10%', cycle: '180 Day', dailyRevenue: '1,000 TZS', totalRevenue: '180,000 TZS' },
  { price: '30,000 TZS', interest: '10%', cycle: '180 Day', dailyRevenue: '3,000 TZS', totalRevenue: '540,000 TZS' },
  { price: '90,000 TZS', interest: '10%', cycle: '180 Day', dailyRevenue: '9,000 TZS', totalRevenue: '1,620,000 TZS' },
  { price: '160,000 TZS', interest: '10%', cycle: '180 Day', dailyRevenue: '16,000 TZS', totalRevenue: '2,880,000 TZS' },
  { price: '300,000 TZS', interest: '10%', cycle: '180 Day', dailyRevenue: '30,000 TZS', totalRevenue: '5,400,000 TZS' },
  { price: '500,000 TZS', interest: '10%', cycle: '180 Day', dailyRevenue: '50,000 TZS', totalRevenue: '9,000,000 TZS' },
  { price: '1,000,000 TZS', interest: '10%', cycle: '180 Day', dailyRevenue: '100,000 TZS', totalRevenue: '18,000,000 TZS' },
  { price: '2,000,000 TZS', interest: '10%', cycle: '180 Day', dailyRevenue: '200,000 TZS', totalRevenue: '36,000,000 TZS' },
  { price: '3,000,000 TZS', interest: '10%', cycle: '180 Day', dailyRevenue: '300,000 TZS', totalRevenue: '54,000,000 TZS' },
  { price: '5,000,000 TZS', interest: '10%', cycle: '180 Day', dailyRevenue: '500,000 TZS', totalRevenue: '90,000,000 TZS' },
];

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <PageHeader title="About Us" />
      <div className="p-4">
        <h1 className="text-xl font-bold text-center mb-6 text-red-400">Product Income Statement</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 rounded-lg">
            <thead>
              <tr className="text-left text-gray-300">
                <th className="p-3">Product Price</th>
                <th className="p-3">Interest Rate</th>
                <th className="p-3">Cycle</th>
                <th className="p-3">Daily Revenue</th>
                <th className="p-3">Total Revenue</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={index} className="border-t border-gray-700 hover:bg-gray-700">
                  <td className="p-3">{product.price}</td>
                  <td className="p-3">{product.interest}</td>
                  <td className="p-3">{product.cycle}</td>
                  <td className="p-3">{product.dailyRevenue}</td>
                  <td className="p-3">{product.totalRevenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
