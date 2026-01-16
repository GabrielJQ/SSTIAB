module.exports = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  department: user.department,
  unit: user.unit,
  employeeNumber: user.employeeNumber,
  createdAt: user.createdAt
});
