const express = require("express");
const { register, login } = require("../controllers/auth.controller");
const { authLimiter } = require("../middlewares/rateLimit.middleware");
const { validate } = require("../middlewares/validation.middleware");
const { loginSchema } = require("../validations/auth.validation");

const router = express.Router();

// 🔐 Rate limit estricto solo para auth
router.post("/register", authLimiter, register);
router.post(
  "/login",
  authLimiter,
  validate(loginSchema),
  login
);

module.exports = router;

