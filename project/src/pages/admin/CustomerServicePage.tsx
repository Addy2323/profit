import React, { useState, useMemo } from 'react';
import { CustomerTicket, CustomerTicketStatus } from '../../types/customer';
import CustomerTicketCard from '../../components/customer/CustomerTicketCard';
import CustomerTicketForm from '../../components/customer/CustomerTicketForm';
import { exportCsv } from '../../utils/csv';

const PAGE_SIZE = 10;

const CustomerServicePage: React.FC = () => {
  const [tickets, setTickets] = useState<CustomerTicket[]>(() => {
    return JSON.parse(localStorage.getItem('profitnet_customer_tickets') || '[]');
  });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState<CustomerTicketStatus>('all');

  const filteredTickets = useMemo(() => {
    return tickets.filter(ticket => {
      const matchesSearch = 
        ticket.title.toLowerCase().includes(search.toLowerCase()) ||
        ticket.description.toLowerCase().includes(search.toLowerCase()) ||
        ticket.customerEmail.toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = selectedStatus === 'all' || ticket.status === selectedStatus;
      
      return matchesSearch && matchesStatus;
    });
  }, [tickets, search, selectedStatus]);

  const saveTickets = (list: CustomerTicket[]) => {
    setTickets(list);
    localStorage.setItem('profitnet_customer_tickets', JSON.stringify(list));
  };

  const addTicket = (ticket: CustomerTicket) => {
    saveTickets([ticket, ...tickets]);
  };

  const updateTicket = (id: string, updates: Partial<CustomerTicket>) => {
    const updatedList = tickets.map(ticket => 
      ticket.id === id ? { ...ticket, ...updates } : ticket
    );
    saveTickets(updatedList);
  };

  const deleteTicket = (id: string) => {
    if (!confirm('Delete this ticket?')) return;
    saveTickets(tickets.filter(ticket => ticket.id !== id));
  };

  const exportTickets = () => {
    const exportData = filteredTickets.map(ticket => ({
      id: ticket.id,
      title: ticket.title,
      description: ticket.description,
      customerEmail: ticket.customerEmail,
      status: ticket.status,
      createdAt: new Date(ticket.createdAt).toLocaleString(),
      updatedAt: new Date(ticket.updatedAt).toLocaleString(),
    }));
    exportCsv(exportData, 'customer_tickets.csv');
  };

  return (
    <div className="p-4">
      <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
        <h1 className="text-2xl font-bold">Customer Service</h1>
        <div className="flex gap-2">
          <button 
            onClick={exportTickets} 
            className="px-3 py-1 bg-indigo-600 text-white rounded text-sm"
          >
            Export CSV
          </button>
          <CustomerTicketForm onAdd={addTicket} />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value as CustomerTicketStatus)}
          className="px-3 py-1 border rounded"
        >
          <option value="all">All Tickets</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tickets..."
          className="px-3 py-1 border rounded"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTickets
          .slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
          .map(ticket => (
            <CustomerTicketCard
              key={ticket.id}
              ticket={ticket}
              onUpdate={updateTicket}
              onDelete={deleteTicket}
            />
          ))}
      </div>

      {filteredTickets.length > PAGE_SIZE && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-3 py-1 border rounded mr-2"
          >
            Previous
          </button>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page * PAGE_SIZE >= filteredTickets.length}
            className="px-3 py-1 border rounded"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomerServicePage;
