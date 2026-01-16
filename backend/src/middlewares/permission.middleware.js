const roles = require("../config/roles");

module.exports = (requiredPermission) => {
  return (req, res, next) => {
    const role = req.user?.role;

    if (!role || !roles[role]) {
      return res.status(403).json({
        message: "Rol no válido",
      });
    }

    const permissions = roles[role];

    if (!permissions.includes(requiredPermission)) {
      return res.status(403).json({
        message: "No tienes permiso para esta acción",
        permission: requiredPermission,
      });
    }

    next();
  };
};
