const ActivityLog = require("../models/activitylog");

exports.getActivityLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find()
      .sort({ createdAt: -1 })
      .populate("user", "name role")
      .populate("ticket", "title");

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo logs", error });
  }
};
