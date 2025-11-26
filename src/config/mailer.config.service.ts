import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailerConfigService {
  constructor(private readonly configService: ConfigService) {}

  get host(): string {
    return this.configService.get<string>('mailer.host')!;
  }

  get username(): string {
    return this.configService.get<string>('mailer.username')!;
  }

  get password(): string {
    return this.configService.get<string>('mailer.password')!;
  }
}
