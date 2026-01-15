const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema(
  {
    ticketNumber: {
      type: String,
      unique: true,
      index: true
    },

    // ========================
    // DATOS DEL PROBLEMA
    // ========================
    description: {
      type: String,
      required: true
    },

    category: {
      type: String,
      enum: [
        "hardware",
        "software",
        "network",
        "printer",
        "access",
        "other"
      ],
      default: "other"
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium"
    },

    status: {
      type: String,
      enum: ["open", "in_progress", "resolved", "closed"],
      default: "open"
    },

    // ========================
    // DATOS DEL USUARIO (FIJOS)
    // ========================
    department: {
      type: String,
      required: true
    },

    requesterSnapshot: {
      name: String,
      employeeNumber: String,
      department: String,
      unit: String
    },

    // ========================
    // RELACIONES
    // ========================
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    // ========================
    // FECHAS
    // ========================
    resolvedAt: Date,
    closedAt: Date,

    // ========================
    // COMENTARIOS
    // ========================
   comments: [
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    role: {
      type: String,
      enum: ["user", "agent", "admin"],
      required: true
    },

    message: {
      type: String,
      required: true
    },

    isInternal: {
      type: Boolean,
      default: false // solo admin/agent pueden verlo
    },

    createdAt: {
      type: Date,
      default: Date.now
    }
  }
]

  },
  { timestamps: true }
);

module.exports = mongoose.model("Ticket", TicketSchema);


