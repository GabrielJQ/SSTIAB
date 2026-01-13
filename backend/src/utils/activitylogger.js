const ActivityLog = require("../models/activitylog");

const logActivity = async ({ action, ticket, user, details }) => {
  try {
    await ActivityLog.create({
      action,
      ticket,
      user,
      details,
    });
  } catch (error) {
    console.error("Error registrando actividad:", error.message);
  }
};

module.exports = logActivity;
