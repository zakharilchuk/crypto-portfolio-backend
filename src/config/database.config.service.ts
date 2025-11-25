import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseConfigService {
  constructor(private readonly configService: ConfigService) {}
  get host(): string {
    return this.configService.get<string>('database.host')!;
  }

  get port(): number {
    return Number(this.configService.get<number>('database.port'));
  }

  get name(): string {
    return this.configService.get<string>('database.name')!;
  }

  get user(): string {
    return this.configService.get<string>('database.user')!;
  }

  get password(): string {
    return this.configService.get<string>('database.password')!;
  }
}
