const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

const {
  createTicket,
  getMyTickets,
  getAgentTickets,
  updateTicketStatus,
  getAllTickets,
  assignTicket,
  addComment,
  getTicketById,
  getTicketComments
} = require("../controllers/ticket.controller");

// ========================
// USER
// ========================
router.post("/", authMiddleware, createTicket);
router.get("/my", authMiddleware, getMyTickets);

// ========================
// AGENT
// ========================
router.get(
  "/agent",
  authMiddleware,
  roleMiddleware("agent", "admin"),
  getAgentTickets
);

router.patch(
  "/:id/status",
  authMiddleware,
  roleMiddleware("agent", "admin"),
  updateTicketStatus
);

// ========================
// ADMIN
// ========================
router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  getAllTickets
);

router.patch(
  "/:id/assign",
  authMiddleware,
  roleMiddleware("admin"),
  assignTicket
);

// ========================
// TICKET INDIVIDUAL
// ========================
router.get("/:id", authMiddleware, getTicketById);

// ========================
// COMMENTS
// ========================
router.post(
  "/:id/comments",
  authMiddleware,
  addComment
);

// ========================
// VER COMENTARIOS DE TICKET
// ========================
router.get(
  "/:id/comments",
  authMiddleware,
  getTicketComments
);


module.exports = router;
