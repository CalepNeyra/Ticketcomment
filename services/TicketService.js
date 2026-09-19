const { v4: uuidv4 } = require("uuid");
const TicketRepository = require("../repositories/TicketRepository");
const NotificationService = require("./NotificationService");

class TicketService {
  constructor() {
    this.repo = new TicketRepository();
    this.notificationService = new NotificationService();
  }

  async createTicket(data) {
    const ticket = {
      id: uuidv4(),
      title: data.title,
      description: data.description,
      status: "nuevo",
      priority: data.priority || "medium",
      assignedUser: null,
      email: data.email || null,
    };

    this.repo.save(ticket);

    await this.notificationService.create(
      "email",
      `Nuevo ticket creado: ${ticket.title}`,
      ticket.id,
      ticket.email
    );

    return ticket;
  }

  async assignTicket(id, user) {
    const ticket = this.repo.update(id, { assignedUser: user });
    if (ticket) {
      await this.notificationService.create(
        "email",
        `El ticket ${ticket.id} fue asignado a ${user}`,
        ticket.id,
        ticket.email
      );
    }
    return ticket;
  }

  changeStatus(id, newStatus) {
    const ticket = this.repo.update(id, { status: newStatus });
    if (ticket) {
      this.notificationService.create(
        "push",
        `El ticket ${ticket.id} cambió a ${newStatus}`,
        ticket.id,
        ticket.email
      );
    }
    return ticket;
  }

  // MÉTODO ACTUALIZADO CON PAGINACIÓN
  list(page = 1, limit = 5) {
    const allTickets = this.repo.findAll();

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 5;

    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = pageNum * limitNum;

    const paginatedTickets = allTickets.slice(startIndex, endIndex);

    return {
      totalItems: allTickets.length,
      totalPages: Math.ceil(allTickets.length / limitNum),
      currentPage: pageNum,
      limit: limitNum,
      data: paginatedTickets,
    };
  }

  deleteTicket(id) {
    const deleted = this.repo.delete(id);
    if (!deleted) {
      throw new Error("Ticket no encontrado");
    }
    return true;
  }
}

module.exports = TicketService;