export const MAILER_SERVICE = Symbol.for('MAILER_SERVICE');

export interface IMailerService {
  sendEmail(to: string, subject: string, body: string): Promise<void>;
}
