const ActivityLog = require("../models/activitylog");

exports.getActivityLogs = async (req, res) => {
  try {
    // Solo admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "No autorizado" });
    }

    const logs = await ActivityLog.find()
      .sort({ createdAt: -1 })
      .populate("user", "name role")
      .populate("ticket", "ticketNumber status");

    res.json(logs);
  } catch (error) {
    res.status(500).json({
      message: "Error obteniendo logs",
      error
    });
  }
};
