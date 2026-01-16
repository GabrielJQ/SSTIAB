const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    employeeNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    unit: {
      type: String,
      required: true,
      trim: true
    },

    department: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
  type: String,
  required: true,
  select: false
}
,

    role: {
      type: String,
      enum: ["user", "agent", "admin"],
      default: "user"
    },

    active: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);

