import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailService.name);

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST'),
      port: this.configService.get<number>('MAIL_PORT') ?? 587,
      secure: false,
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASS'),
      },
    });
  }

  async sendPasswordReset(email: string, token: string): Promise<void> {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL') ?? 'http://localhost:3000';
    const resetUrl = `${frontendUrl}/reset-password?token=${token}`;

    await this.transporter.sendMail({
      from: `"Janak Positioning" <${this.configService.get('MAIL_USER')}>`,
      to: email,
      subject: 'Reset your password',
      html: `
        <p>You requested a password reset.</p>
        <p>Click the link below to reset your password. This link expires in 15 minutes.</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>If you did not request this, ignore this email.</p>
      `,
    }).catch((err) => {
      this.logger.error(`Failed to send reset email to ${email}: ${err.message}`);
      throw err;
    });
  }
}
