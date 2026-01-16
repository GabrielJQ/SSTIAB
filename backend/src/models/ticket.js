const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema(
  {
    // ========================
    // IDENTIFICADOR
    // ========================
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
      required: true
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
    // DATOS DEL USUARIO (SNAPSHOT)
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
    // HISTORIAL DE ESTADOS
    // ========================
    statusHistory: [
      {
        status: {
          type: String,
          enum: ["open", "in_progress", "resolved", "closed"]
        },
        changedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
        changedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],

    // ========================
    // COMENTARIOS (CORREGIDO)
    // ========================
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true
        },
        message: {
          type: String,
          required: true
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
