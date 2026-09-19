const TicketService = require("../services/TicketService");
const NotificationService = require("../services/NotificationService");

const service = new TicketService();
const notificationService = new NotificationService();

exports.create = async (req, res, next) => {
  try {
    const ticket = await service.createTicket(req.body);
    res.status(201).json(ticket);
  } catch (error) {
    next(error);
  }
};

exports.list = (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const result = service.list(page, limit);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

exports.assign = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { user } = req.body;
    const ticket = await service.assignTicket(id, user);
    if (!ticket) return res.status(404).json({ error: "Ticket no encontrado" });
    res.status(200).json(ticket);
  } catch (error) {
    next(error);
  }
};

exports.changeStatus = (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const ticket = service.changeStatus(id, status);
    if (!ticket) return res.status(404).json({ error: "Ticket no encontrado" });
    res.status(200).json(ticket);
  } catch (error) {
    next(error);
  }
};

exports.delete = (req, res, next) => {
  try {
    service.deleteTicket(req.params.id);
    res.json({ message: "Ticket eliminado correctamente" });
  } catch (err) {
    next(err);
  }
};

// MÉTODO NUEVO PARA OBTENER HISTORIAL DE NOTIFICACIONES
exports.getNotificationsByTicket = (req, res, next) => {
  try {
    const { id } = req.params;
    const notifications = notificationService.getByTicketId(id);
    res.status(200).json(notifications);
  } catch (error) {
    next(error);
  }
};