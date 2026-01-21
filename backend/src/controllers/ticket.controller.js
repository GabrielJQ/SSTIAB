const Ticket = require("../models/ticket");
const User = require("../models/user");
const logActivity = require("../utils/activitylogger");
const checkTicketAccess = require("../utils/checkTicketAccess");
const {
  ticketUserDTO,
  ticketAgentDTO,
  ticketAdminDTO
} = require("../dtos/ticket.dto");

// ========================
// CREATE TICKET (USER)
// ========================
exports.createTicket = async (req, res) => {
  try {
    const { description, category } = req.body;
    const user = req.user;

    if (!description || !category) {
      return res.status(400).json({
        message: "Descripción y categoría son obligatorias"
      });
    }

    const ticket = await Ticket.create({
      description,
      category,
      department: user.department,
      requesterSnapshot: {
        name: user.name,
        employeeNumber: user.employeeNumber,
        unit: user.unit,
        department: user.department
      },
      createdBy: user._id
    });

    await logActivity(user._id, "CREATE_TICKET", ticket._id);

    res.status(201).json(ticketUserDTO(ticket));
  } catch (error) {
    res.status(500).json({ message: "Error creando ticket" });
  }
};

// ========================
// USER: MY TICKETS
// ========================
exports.getMyTickets = async (req, res) => {
  const tickets = await Ticket.find({ createdBy: req.user._id })
    .sort({ createdAt: -1 });

  res.json({
    total: tickets.length,
    tickets: tickets.map(ticketUserDTO)
  });
};

// ========================
// AGENT: ASSIGNED TICKETS
// ========================
exports.getAgentTickets = async (req, res) => {
  const tickets = await Ticket.find({ assignedTo: req.user._id })
    .sort({ createdAt: -1 });

  res.json(tickets.map(ticketAgentDTO));
};

// ========================
// UPDATE STATUS (AGENT / ADMIN)
// ========================
exports.updateTicketStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatus = ["in_progress", "resolved", "closed"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Estado no válido" });
    }

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket no encontrado" });
    }

    // 🔒 Ownership
    if (
      req.user.role === "agent" &&
      ticket.assignedTo?.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "No autorizado" });
    }

    if (!["agent", "admin"].includes(req.user.role)) {
      return res.status(403).json({ message: "No autorizado" });
    }

    ticket.status = status;
    if (status === "resolved") ticket.resolvedAt = new Date();
    if (status === "closed") ticket.closedAt = new Date();

    await ticket.save();

    await logActivity(
      req.user._id,
      "UPDATE_TICKET_STATUS",
      ticket._id,
      `Estado cambiado a ${status}`
    );

    return res.json(
      req.user.role === "admin"
        ? ticketAdminDTO(ticket)
        : ticketAgentDTO(ticket)
    );
  } catch (error) {
    res.status(500).json({ message: "Error actualizando ticket" });
  }
};

// ========================
// ADMIN: ALL TICKETS (CONTROLADO)
// ========================
exports.getAllTickets = async (req, res) => {
  const { status, priority, department, assignedTo } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (department) filter.department = department;
  if (assignedTo) filter.assignedTo = assignedTo;

  const tickets = await Ticket.find(filter)
    .sort({ createdAt: -1 })
    .populate("assignedTo", "name email role")
    .populate("createdBy", "name employeeNumber department");

  res.json(tickets.map(ticketAdminDTO));
};

// ========================
// ASSIGN TICKET (ADMIN)
// ========================
exports.assignTicket = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Solo admin puede asignar" });
    }

    const { agentId } = req.body;

    const agent = await User.findById(agentId);
    if (!agent || agent.role !== "agent") {
      return res.status(400).json({ message: "Agente inválido" });
    }

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket no encontrado" });
    }

    ticket.assignedTo = agentId;
    ticket.status = "in_progress";

    await ticket.save();

    await logActivity(
      req.user._id,
      "ASSIGN_TICKET",
      ticket._id,
      `Asignado a ${agent.name}`
    );

    res.json(ticketAdminDTO(ticket));
  } catch (error) {
    res.status(500).json({ message: "Error asignando ticket" });
  }
};

// ========================
// COMMENTS (PENDIENTES DE AMPLIAR)
// ========================
exports.addComment = async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) {
    return res.status(404).json({ message: "Ticket no encontrado" });
  }

  if (!checkTicketAccess(ticket, req.user)) {
    return res.status(403).json({ message: "No autorizado" });
  }

  ticket.comments.push({
    user: req.user._id,
    message: req.body.message
  });

  await ticket.save();
  await logActivity(req.user._id, "ADD_COMMENT", ticket._id);

  res.status(201).json({ message: "Comentario agregado" });
};

// ========================
// GET COMMENTS
// ========================
exports.getTicketComments = async (req, res) => {
  const ticket = await Ticket.findById(req.params.id)
    .populate("comments.user", "name");

  if (!ticket) {
    return res.status(404).json({ message: "Ticket no encontrado" });
  }

  if (!checkTicketAccess(ticket, req.user)) {
    return res.status(403).json({ message: "No autorizado" });
  }

  res.json(
    ticket.comments.map(c => ({
      message: c.message,
      author: c.user?.name || "Sistema",
      createdAt: c.createdAt
    }))
  );
};

// ========================
// GET TICKET BY ID
// ========================
exports.getTicketById = async (req, res) => {
  const ticket = await Ticket.findById(req.params.id)
    .populate("assignedTo", "name email role")
    .populate("createdBy", "name employeeNumber department");

  if (!ticket) {
    return res.status(404).json({ message: "Ticket no encontrado" });
  }

  if (!checkTicketAccess(ticket, req.user)) {
    return res.status(403).json({ message: "No autorizado" });
  }

  if (req.user.role === "admin") return res.json(ticketAdminDTO(ticket));
  if (req.user.role === "agent") return res.json(ticketAgentDTO(ticket));

  res.json(ticketUserDTO(ticket));
};

