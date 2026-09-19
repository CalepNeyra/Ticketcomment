const nodemailer = require("nodemailer");

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.MAILER_SERVICE || "gmail",
      auth: {
        user: process.env.MAILER_EMAIL,
        pass: process.env.MAILER_SECRET_KEY,
      },
    });
  }

  async sendEmail({ to, subject, htmlBody }) {
    try {
      console.log(`Intentando enviar correo a: ${to}...`);
      
      const info = await this.transporter.sendMail({
        from: `Soporte API <${process.env.MAILER_EMAIL}>`,
        to: to,
        subject: subject,
        html: htmlBody,
      });

      console.log("✅ EMAIL ENVIADO CON ÉXITO:", info.messageId);
      return info;
    } catch (error) {
      console.error("❌ ERROR CRÍTICO AL ENVIAR EMAIL:", error.message);
      throw error;
    }
  }
}

module.exports = EmailService;