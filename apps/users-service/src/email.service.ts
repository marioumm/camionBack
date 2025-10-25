import { Injectable, Logger } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly fromEmail: string;

  constructor() {
    const apiKey = process.env.SENDGRID_API_KEY || '';
    if (apiKey) {
      sgMail.setApiKey(apiKey);
    }
    this.fromEmail = process.env.SENDGRID_FROM_EMAIL || 'no-reply@example.com';
  }

  async sendOtp(toEmail: string, code: string): Promise<void> {
    const msg = {
      to: toEmail,
      from: this.fromEmail,
      subject: 'Your Camion verification code',
      text: `Your verification code is ${code}`,
      html: `<p>Your verification code is <strong>${code}</strong></p>`,
    } as sgMail.MailDataRequired;

    try {
      await sgMail.send(msg);
      this.logger.log(`OTP email sent to ${toEmail}`);
    } catch (error) {
      this.logger.error('Failed to send OTP email', error as any);
      throw error;
    }
  }
}
