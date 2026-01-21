const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const { authLimiter } = require("../middlewares/rateLimit.middleware");

const {
  getMyProfile,
  updateMyProfile,
  changeMyPassword
} = require("../controllers/user.controller");

// ========================
// MI PERFIL
// ========================
router.get("/me", authMiddleware, getMyProfile);
router.put("/me", authMiddleware, updateMyProfile);

// CAMBIO DE CONTRASEÑA
router.put("/me/password", authMiddleware, authLimiter, changeMyPassword);

module.exports = router;
