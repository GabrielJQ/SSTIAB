exports.ticketUserDTO = (ticket) => ({
  id: ticket._id,
  ticketNumber: ticket.ticketNumber,
  description: ticket.description,
  category: ticket.category,
  priority: ticket.priority,
  status: ticket.status,
  createdAt: ticket.createdAt,
  updatedAt: ticket.updatedAt
});
