const express = require("express");
const router = express.Router();

// ========================
// IMPORT ROUTES
// ========================
const authRoutes = require("./auth.routes");
const ticketRoutes = require("./ticket.routes");
const userRoutes = require("./user.routes");
const adminUserRoutes = require("./admin.users.routes");
const activityRoutes = require("./activity.routes");




// ========================
// HEALTH CHECK
// ========================
router.get("/", (req, res) => {
  res.json({ message: "API de Soporte TI activa" });
});



// ========================
// ROUTES
// ========================
router.use("/auth", authRoutes);
router.use("/tickets", ticketRoutes);
router.use("/users", userRoutes);
router.use("/admin/users", adminUserRoutes);
router.use("/activity", activityRoutes);

module.exports = router;
