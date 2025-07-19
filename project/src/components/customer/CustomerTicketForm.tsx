import React, { useState } from 'react';
import { CustomerTicket } from '../../types/customer';

interface CustomerTicketFormProps {
  onAdd: (ticket: CustomerTicket) => void;
}

const CustomerTicketForm: React.FC<CustomerTicketFormProps> = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !customerEmail) return;

    const newTicket: CustomerTicket = {
      id: Date.now().toString(),
      title,
      description,
      customerEmail,
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onAdd(newTicket);
    setTitle('');
    setDescription('');
    setCustomerEmail('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-3">New Ticket</h3>
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded h-24"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Customer Email</label>
          <input
            type="email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Create Ticket
        </button>
      </div>
    </form>
  );
};

export default CustomerTicketForm;
