export type CustomerTicketStatus = 'pending' | 'in_progress' | 'resolved';

export interface CustomerTicket {
  id: string;
  title: string;
  description: string;
  customerEmail: string;
  status: CustomerTicketStatus;
  createdAt: string;
  updatedAt: string;
}
