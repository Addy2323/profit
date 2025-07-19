import React from 'react';
import { CustomerTicket, CustomerTicketStatus } from '../../types/customer';

interface CustomerTicketCardProps {
  ticket: CustomerTicket;
  onUpdate: (id: string, updates: Partial<CustomerTicket>) => void;
  onDelete: (id: string) => void;
}

const statusColors: Record<CustomerTicketStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  resolved: 'bg-green-100 text-green-800',
};

const CustomerTicketCard: React.FC<CustomerTicketCardProps> = ({ ticket, onUpdate, onDelete }) => {
  const handleStatusChange = (status: CustomerTicketStatus) => {
    onUpdate(ticket.id, { status, updatedAt: new Date().toISOString() });
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      onDelete(ticket.id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-2">
        <span className={`px-2 py-1 rounded-full text-sm ${statusColors[ticket.status]}`}>
          {ticket.status.replace('_', ' ')}
        </span>
        <div className="flex gap-2">
          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700"
          >
            Delete
          </button>
        </div>
      </div>
      
      <h3 className="text-lg font-semibold mb-2">{ticket.title}</h3>
      <p className="text-gray-600 mb-3">{ticket.description}</p>
      <div className="flex justify-between text-sm text-gray-500">
        <span>Customer: {ticket.customerEmail}</span>
        <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
      </div>
      
      <div className="mt-4">
        <select
          value={ticket.status}
          onChange={(e) => handleStatusChange(e.target.value as CustomerTicketStatus)}
          className="px-3 py-1 border rounded"
        >
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>
    </div>
  );
};

export default CustomerTicketCard;
