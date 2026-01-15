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
  getTicketById
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
// VER TICKET INDIVIDUAL
// ========================
router.get(
  "/:id",
  authMiddleware,
  getTicketById
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
// COMMENTS
// ========================
router.post(
  "/:id/comments",
  authMiddleware,
  addComment
);

module.exports = router;


