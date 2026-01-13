const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");
const { getActivityLogs } = require("../controllers/activity.controller");

router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  getActivityLogs
);

module.exports = router;
