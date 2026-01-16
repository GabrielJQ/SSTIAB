const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");

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
router.put("/me/password", authMiddleware, changeMyPassword);

module.exports = router;
