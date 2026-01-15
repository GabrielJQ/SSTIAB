const User = require("../models/user");
const bcrypt = require("bcrypt");

exports.getUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

exports.createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  const hash = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hash,
    role
  });

  res.status(201).json(user);
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;

  const user = await User.findByIdAndUpdate(
    id,
    req.body,
    { new: true }
  ).select("-password");

  res.json(user);
};
