// ========================
// USER VIEW
// ========================
exports.ticketUserDTO = ticket => ({
  id: ticket._id,
  ticketNumber: ticket.ticketNumber,
  description: ticket.description,
  category: ticket.category,
  priority: ticket.priority,
  status: ticket.status,
  createdAt: ticket.createdAt,
  updatedAt: ticket.updatedAt
});

// ========================
// AGENT VIEW
// ========================
exports.ticketAgentDTO = ticket => ({
  id: ticket._id,
  ticketNumber: ticket.ticketNumber,
  description: ticket.description,
  category: ticket.category,
  priority: ticket.priority,
  status: ticket.status,
  department: ticket.department,
  requester: ticket.requesterSnapshot,
  createdAt: ticket.createdAt,
  updatedAt: ticket.updatedAt
});

// ========================
// ADMIN VIEW
// ========================
exports.ticketAdminDTO = ticket => ({
  ...exports.ticketAgentDTO(ticket),
  assignedTo: ticket.assignedTo,
  createdBy: ticket.createdBy
});
