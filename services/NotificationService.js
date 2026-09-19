const { v4: uuidv4 } = require("uuid");
const NotificationRepository = require("../repositories/NotificationRepository");
const EmailService = require("./email/EmailService");

class NotificationService {
  constructor() {
    this.repo = new NotificationRepository();
    this.emailService = new EmailService();
  }

  async create(type, message, ticketId, userEmail) {
    const notification = {
      id: uuidv4(),
      type,
      message,
      status: "pending",
      ticketId,
    };

    if (type === "email") {
      const targetEmail = userEmail || process.env.MAILER_EMAIL;

      try {
        console.log(`[NotificationService] Iniciando envío a: ${targetEmail}`);
        await this.emailService.sendEmail({
          to: targetEmail,
          subject: "Notificación de Ticket",
          htmlBody: `<h2>Detalle del Ticket</h2><p>${message}</p>`,
        });
      } catch (err) {
        console.error("[NotificationService] Falló el envío:", err.message);
      }
    }

    return this.repo.save(notification);
  }

  list() {
    return this.repo.findAll();
  }

  // MÉTODO NUEVO PARA OBTENER NOTIFICACIONES POR TICKET
  getByTicketId(ticketId) {
    const notifications = this.repo.findAll();
    return notifications.filter((n) => n.ticketId === ticketId);
  }
}

module.exports = NotificationService;