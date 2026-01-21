module.exports = (ticket, user) => {
  if (user.role === "admin") return true;

  if (user.role === "agent") {
    return (
      ticket.assignedTo &&
      ticket.assignedTo.toString() === user._id.toString()
    );
  }

  // user normal
  return ticket.createdBy.toString() === user._id.toString();
};
