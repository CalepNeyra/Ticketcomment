const express = require("express");
const router = express.Router();
const ticketController = require("../controllers/TicketController");

router.post("/", ticketController.create);
router.get("/", ticketController.list);
router.put("/:id/assign", ticketController.assign);
router.put("/:id/status", ticketController.changeStatus);
router.delete("/:id", ticketController.delete);

// RUTA NUEVA PARA OBTENER NOTIFICACIONES DE UN TICKET
router.get("/:id/notifications", ticketController.getNotificationsByTicket);

module.exports = router;