import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendPasswordResetEmail(email: string, resetToken: string) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: `"SaveSmart" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Recuperación de Contraseña - SaveSmart',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              padding: 30px;
              border-radius: 10px;
            }
            .content {
              background: white;
              padding: 30px;
              border-radius: 8px;
            }
            .button {
              display: inline-block;
              padding: 12px 30px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
              font-weight: bold;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              font-size: 12px;
              color: #fff;
            }
            .warning {
              background: #fff3cd;
              border-left: 4px solid #ffc107;
              padding: 12px;
              margin: 20px 0;
              border-radius: 4px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="content">
              <h2 style="color: #667eea; margin-top: 0;">Recuperación de Contraseña</h2>
              <p>Hola,</p>
              <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta en SaveSmart.</p>
              <p>Haz clic en el siguiente botón para crear una nueva contraseña:</p>

              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Restablecer Contraseña</a>
              </div>

              <div class="warning">
                <strong>⚠️ Importante:</strong> Este enlace expirará en 30 minutos por razones de seguridad.
              </div>

              <p>Si no solicitaste restablecer tu contraseña, puedes ignorar este correo de forma segura.</p>

              <p style="margin-top: 30px;">
                <strong>¿El botón no funciona?</strong><br>
                Copia y pega este enlace en tu navegador:<br>
                <a href="${resetUrl}" style="color: #667eea; word-break: break-all;">${resetUrl}</a>
              </p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} SaveSmart. Todos los derechos reservados.</p>
              <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return { success: true };
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('No se pudo enviar el correo de recuperación');
    }
  }
}
