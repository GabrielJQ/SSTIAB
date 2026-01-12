const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");
const {
  createTicket,
  getMyTickets,
  updateTicketStatus,
  getAllTickets,
  assignTicket,
} = require("../controllers/ticket.controller");

// Usuario
router.post("/", authMiddleware, createTicket);
router.get("/", authMiddleware, getMyTickets);

// Agente / Admin
router.get(
  "/all",
  authMiddleware,
  roleMiddleware("agent", "admin"),
  getAllTickets
);

router.put(
  "/:id/assign",
  authMiddleware,
  roleMiddleware("admin"),
  assignTicket
);

router.put("/:id/status", authMiddleware, updateTicketStatus);

module.exports = router;
