const Ticket = require("../models/ticket");
const logActivity = require("../utils/activitylogger");

// ========================
// USER
// ========================

// Crear ticket
exports.createTicket = async (req, res) => {
  try {
    const ticket = await Ticket.create({
      description: req.body.description,
      department: req.user.department,
      createdBy: req.user._id,
      priority: "medium",
      status: "open"
    });

    await logActivity(
      req.user._id,
      "CREATE_TICKET",
      ticket._id,
      "Ticket creado por usuario"
    );

    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ message: "Error creando ticket", error });
  }
};

// Ver MIS tickets
exports.getMyTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 })
      .populate("assignedTo", "name email role");

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo tickets", error });
  }
};

// ========================
// AGENT
// ========================

// Tickets asignados al agente
exports.getAgentTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ assignedTo: req.user._id })
      .sort({ createdAt: -1 })
      .populate("createdBy", "name employeeNumber department");

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo tickets", error });
  }
};

// Cambiar estado del ticket
exports.updateTicketStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket no encontrado" });
    }

    if (!["agent", "admin"].includes(req.user.role)) {
      return res.status(403).json({ message: "No autorizado" });
    }

    ticket.status = status;

    if (status === "resolved") {
      ticket.resolvedAt = new Date();
    }

    if (status === "closed") {
      ticket.closedAt = new Date();
    }

    await ticket.save();

    await logActivity(
      req.user._id,
      "UPDATE_STATUS",
      ticket._id,
      `Estado cambiado a ${status}`
    );

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: "Error actualizando ticket", error });
  }
};

// ========================
// ADMIN
// ========================

// Ver TODOS los tickets (con filtros)
exports.getAllTickets = async (req, res) => {
  try {
    const {
      status,
      priority,
      department,
      assignedTo,
      createdBy
    } = req.query;

    const filter = {};

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (department) filter.department = department;
    if (assignedTo) filter.assignedTo = assignedTo;
    if (createdBy) filter.createdBy = createdBy;

    const tickets = await Ticket.find(filter)
      .sort({ createdAt: -1 })
      .populate("createdBy", "name employeeNumber department")
      .populate("assignedTo", "name email role");

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo tickets", error });
  }
};

// Asignar ticket a agente
exports.assignTicket = async (req, res) => {
  try {
    const { agentId } = req.body;

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
      `Asignado al agente ${agentId}`
    );

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: "Error asignando ticket", error });
  }
};

// ========================
// COMMENTS
// ========================

// Agregar comentario
exports.addComment = async (req, res) => {
  try {
    const { message, isInternal = false } = req.body;

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket no encontrado" });
    }

    // Permisos
    if (
      req.user.role === "user" &&
      ticket.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "No autorizado" });
    }

    if (
      req.user.role === "agent" &&
      ticket.assignedTo?.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "No autorizado" });
    }

    if (req.user.role === "user" && isInternal) {
      return res.status(403).json({ message: "Comentario interno no permitido" });
    }

    ticket.comments.push({
      user: req.user._id,
      role: req.user.role,
      message,
      isInternal
    });

    await ticket.save();

    await logActivity(
      req.user._id,
      "ADD_COMMENT",
      ticket._id,
      isInternal ? "Comentario interno" : "Comentario público"
    );

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: "Error agregando comentario", error });
  }
};

// ========================
// VER TICKET INDIVIDUAL
// ========================
exports.getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate("createdBy", "name employeeNumber department role")
      .populate("assignedTo", "name email role")
      .populate("comments.user", "name role");

    if (!ticket) {
      return res.status(404).json({ message: "Ticket no encontrado" });
    }

    // 🔒 Permisos
    if (
      req.user.role === "user" &&
      ticket.createdBy._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "No autorizado" });
    }

    if (
      req.user.role === "agent" &&
      ticket.assignedTo &&
      ticket.assignedTo._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "No autorizado" });
    }

    // 🚫 Filtrar comentarios internos para usuarios
    let filteredTicket = ticket.toObject();

    if (req.user.role === "user") {
      filteredTicket.comments = filteredTicket.comments.filter(
        c => !c.isInternal
      );
    }

    res.json(filteredTicket);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo ticket", error });
  }
};


