const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

// ========================
// REGISTER
// ========================
exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      employeeNumber,
      unit,
      department,
      role // opcional, solo admin debería usarlo
    } = req.body;

    // Validación básica
    if (
      !name ||
      !email ||
      !password ||
      !employeeNumber ||
      !unit ||
      !department
    ) {
      return res.status(400).json({
        message: "Todos los campos son obligatorios"
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        message: "El usuario ya existe"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      employeeNumber,
      unit,
      department,
      role: role || "user" // por defecto user
    });

    res.status(201).json({
      message: "Usuario registrado correctamente",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        employeeNumber: user.employeeNumber,
        unit: user.unit,
        department: user.department,
        role: user.role
      }
    });
  } catch (error) {
    console.error("ERROR REGISTER 👉", error);
    res.status(500).json({
      message: "Error interno en registro"
    });
  }
};

// ========================
// LOGIN
// ========================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email y password requeridos"
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Credenciales inválidas"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Credenciales inválidas"
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "8h"
      }
    );

    res.json({
      message: "Login exitoso",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        employeeNumber: user.employeeNumber,
        unit: user.unit,
        department: user.department,
        role: user.role
      }
    });
  } catch (error) {
    console.error("ERROR LOGIN 👉", error);
    res.status(500).json({
      message: "Error en login"
    });
  }
};
