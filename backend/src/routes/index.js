const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/", (req, res) => {
  res.json({ message: "API de Soporte TI activa 🚀" });
});

router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Ruta protegida ✅",
    user: req.user,
  });
});

router.use("/auth", require("./auth.routes"));
router.use("/tickets", require("./ticket.routes"));
router.use("/activity", require("./activity.routes"));



module.exports = router;
