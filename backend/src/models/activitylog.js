const mongoose = require("mongoose");

const ActivityLogSchema = new mongoose.Schema(
  {
    // ========================
    // ACCIÓN NORMALIZADA
    // ========================
    action: {
      type: String,
      enum: [
        "CREATE_TICKET",
        "UPDATE_TICKET",
        "CHANGE_STATUS",
        "ASSIGN_TICKET",
        "ADD_COMMENT",
        "CREATE_USER",
        "UPDATE_USER",
        "LOGIN",
        "LOGOUT"
      ],
      required: true
    },

    // ========================
    // MODULO AFECTADO
    // ========================
    module: {
      type: String,
      enum: ["ticket", "user", "auth", "system"],
      required: true
    },

    // ========================
    // RELACIONES
    // ========================
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
      default: null
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // ========================
    // SNAPSHOT DEL USUARIO
    // ========================
    userSnapshot: {
      name: String,
      role: String,
      department: String
    },

    // ========================
    // DETALLE DEL CAMBIO
    // ========================
    details: {
      type: String
    },

    previousValue: {
      type: mongoose.Schema.Types.Mixed
    },

    newValue: {
      type: mongoose.Schema.Types.Mixed
    },

    // ========================
    // CONTEXTO
    // ========================
    ipAddress: String,
    userAgent: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("ActivityLog", ActivityLogSchema);

