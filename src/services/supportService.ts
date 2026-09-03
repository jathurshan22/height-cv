import { api, type TicketCategory } from './api';

export const supportService = {
  listFaqs: () => api.listFaqs(),
  myTickets: () => api.myTickets(),
  createTicket: (
    subject: string,
    category: TicketCategory,
    message: string,
  ) => api.createTicket({ subject, category, message }),
  adminTickets: () => api.adminTickets(),
};
