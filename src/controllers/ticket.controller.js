const Ticket = require("../models/ticket");

exports.createTicket = async (req, res) => {
  try {
    const { title, description, priority } = req.body;

    const ticket = await Ticket.create({
      title,
      description,
      priority,
      user: req.user._id,
    });

    res.status(201).json({
      message: "Ticket creado correctamente",
      ticket,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creando ticket", error });
  }
};

exports.getMyTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("assignedTo", "name email");

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo tickets", error });
  }
};

exports.updateTicketStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket no encontrado" });
    }

    // Solo dueño o admin puede modificar
    if (
      ticket.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "No autorizado" });
    }

    ticket.status = status;
    await ticket.save();

    res.json({ message: "Estado actualizado", ticket });
  } catch (error) {
    res.status(500).json({ message: "Error actualizando ticket", error });
  }
};

// Ver TODOS los tickets (agent / admin)
exports.getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .sort({ createdAt: -1 })
      .populate("user", "name email")
      .populate("assignedTo", "name email");

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo tickets", error });
  }
};

// Asignar ticket a un agente
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

    res.json({ message: "Ticket asignado correctamente", ticket });
  } catch (error) {
    res.status(500).json({ message: "Error asignando ticket", error });
  }
};
