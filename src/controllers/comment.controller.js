const Comment = require("../models/comment");
const Ticket = require("../models/ticket");

exports.addComment = async (req, res) => {
  try {
    const { message } = req.body;
    const { ticketId } = req.params;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket no encontrado" });
    }

    const comment = await Comment.create({
      ticket: ticketId,
      user: req.user._id,
      message,
    });

    res.status(201).json({ message: "Comentario agregado", comment });
  } catch (error) {
    res.status(500).json({ message: "Error agregando comentario", error });
  }
};

exports.getCommentsByTicket = async (req, res) => {
  try {
    const comments = await Comment.find({ ticket: req.params.ticketId })
      .sort({ createdAt: 1 })
      .populate("user", "name role");

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo comentarios", error });
  }
};
