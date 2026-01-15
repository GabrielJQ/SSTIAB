const User = require("../models/user");

// Ver todos los usuarios
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo usuarios", error });
  }
};
