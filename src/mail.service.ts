import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    // Configure Nodemailer with SMTP settings
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // Use your email provider (e.g., 'gmail' or SMTP settings)
      auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // App password (not your main password)
      },
    });
  }

  async sendResetToken(email: string, token: string) {
    const resetUrl = `http://localhost:5500/api/v1/auth/reset-password/${token}`; // Adjust for frontend

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      text: `Click the following link to reset your password: ${resetUrl}`,
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Reset email sent to ${email}`);
    } catch (error) {
      console.error('Error sending reset email:', error);
    }
  }
}
