const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const routes = require("./routes");

const app = express();

// Middlewares globales
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// Rutas
app.use("/api", routes);

module.exports = app;
