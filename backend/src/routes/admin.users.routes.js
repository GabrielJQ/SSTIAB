const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

const {
  getAllUsers,
  createUser,
  updateUserByAdmin
} = require("../controllers/user.controller");

// ========================
// ADMIN USERS
// ========================

// Ver todos los usuarios
router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  getAllUsers
);

// Crear usuario
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  createUser
);

// Editar usuario
router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  updateUserByAdmin
);

module.exports = router;
