const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");
const { getAllUsers } = require("../controllers/admin.user.controller");

router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  getAllUsers
);

module.exports = router;
