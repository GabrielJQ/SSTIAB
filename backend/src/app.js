const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const routes = require("./routes");
const { apiLimiter } = require("./middlewares/rateLimit.middleware");

const app = express();

// 🔐 Necesario para rate limit detrás de proxy
app.set("trust proxy", 1);

// ========================
// GLOBAL MIDDLEWARES
// ========================
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// 🔒 Rate limit GLOBAL
app.use(apiLimiter);

// ========================
// ROUTES
// ========================
app.use("/api", routes);

module.exports = app;

