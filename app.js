const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const ticketRouter = require("./routes/ticket.routes");
const notificationRouter = require("./routes/notification.routes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

// Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Rutas
app.use("/tickets", ticketRouter);
app.use("/notifications", notificationRouter);

// Middleware Global de Errores (Siempre después de las rutas)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});