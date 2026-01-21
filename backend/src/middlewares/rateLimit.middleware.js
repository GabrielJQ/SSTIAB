const rateLimit = require("express-rate-limit");

// Limite general (API)
exports.apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 requests por IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Demasiadas solicitudes, intenta más tarde"
  }
});

// Limite estricto (auth / password)
exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // solo 10 intentos
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Demasiados intentos, intenta más tarde"
  }
});
