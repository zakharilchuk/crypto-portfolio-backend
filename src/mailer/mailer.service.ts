import { MailerService } from '@nestjs-modules/mailer';
import { IMailerService } from './mailer.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailerServiceImpl implements IMailerService {
  constructor(private readonly mailerService: MailerService) {}
  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to,
        subject,
        html: body,
      });
      console.log('Email sent');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}
