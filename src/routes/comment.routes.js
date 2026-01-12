const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const {
  addComment,
  getCommentsByTicket,
} = require("../controllers/comment.controller");

router.post("/:ticketId", authMiddleware, addComment);
router.get("/:ticketId", authMiddleware, getCommentsByTicket);

module.exports = router;
