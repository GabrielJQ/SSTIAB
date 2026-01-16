const User = require("../models/user");
const bcrypt = require("bcrypt");
const logActivity = require("../utils/activitylogger");
const sanitizeUser = require("../utils/sanitizeUser");
const sanitizeUserAdmin = require("../utils/sanatizeUserAdmin");

// ========================
// ADMIN
// ========================

// Ver todos los usuarios
exports.getAllUsers = async (req, res) => {
  const users = await User.find();
  res.json(users.map(sanitizeUserAdmin));
};

// Crear usuario (admin)
exports.createUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      employeeNumber,
      department,
      unit
    } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Usuario ya existe" });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hash,
      role,
      employeeNumber,
      department,
      unit
    });

    await logActivity(
      req.user._id,
      "CREATE_USER",
      null,
      `Usuario creado: ${email}`
    );

    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creando usuario",
      error
    });
  }
};

// Editar usuario (admin)
exports.updateUserByAdmin = async (req, res) => {
  const { employeePassword, updates } = req.body;

  if (!employeePassword) {
    return res.status(400).json({
      message: "Se requiere la contraseña del empleado para confirmar cambios"
    });
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }

  // Verificar contraseña del empleado
  const match = await bcrypt.compare(employeePassword, user.password);
  if (!match) {
    return res.status(403).json({
      message: "Contraseña del empleado incorrecta"
    });
  }

  const allowedFields = [
    "name",
    "email",
    "role",
    "employeeNumber",
    "department",
    "unit",
    "isActive"
  ];

  const safeUpdates = {};
  allowedFields.forEach(field => {
    if (updates && updates[field] !== undefined) {
      safeUpdates[field] = updates[field];
    }
  });

  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    safeUpdates,
    { new: true, runValidators: true }
  );

  await logActivity(
    req.user._id,
    "ADMIN_UPDATE_USER",
    user._id,
    "Actualización confirmada con contraseña del empleado"
  );

  res.json({
    message: "Usuario actualizado correctamente",
    user: sanitizeUserAdmin(updatedUser)
  });
};

// ========================
// USER (SELF)
// ========================

// Ver mi perfil
exports.getMyProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.json({
  user: sanitizeUser(user)
});
};

// Editar mi perfil
exports.updateMyProfile = async (req, res) => {
  const updates = {};
  if (req.body.name) updates.name = req.body.name;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    updates,
    { new: true, runValidators: true }
  );

  res.json({
    user: sanitizeUser(user)
  });
};


// Cambiar mi contraseña
exports.changeMyPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Contraseña actual y nueva contraseña son requeridas"
      });
    }

    const user = await User.findById(req.user._id).select("+password");

    if (!user || !user.password) {
      return res.status(404).json({
        message: "Usuario no encontrado o contraseña no disponible"
      });
    }

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      return res.status(403).json({
        message: "Contraseña actual incorrecta"
      });
    }

    const samePassword = await bcrypt.compare(newPassword, user.password);
    if (samePassword) {
      return res.status(400).json({
        message: "La nueva contraseña no puede ser igual a la anterior"
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    await logActivity(
      user._id,
      "CHANGE_PASSWORD",
      null,
      "Cambio de contraseña"
    );

    res.json({
      message: "Contraseña actualizada correctamente"
    });
  } catch (error) {
    console.error("ERROR CHANGE PASSWORD 👉", error);
    res.status(500).json({
      message: "Error al cambiar contraseña"
    });
  }
};
