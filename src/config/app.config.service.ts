import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  get port(): number {
    return Number(this.configService.get<number>('app.port'));
  }

  get appName(): string {
    return this.configService.get<string>('app.name')!;
  }

  get appVersion(): string {
    return this.configService.get<string>('app.version')!;
  }

  get accessTokenSecretKey(): string {
    return this.configService.get<string>('app.accessTokenSecretKey')!;
  }

  get accessTokenExpirationTime(): number {
    return this.configService.get<number>('app.accessTokenExpirationTime')!;
  }

  get refreshTokenSecretKey(): string {
    return this.configService.get<string>('app.refreshTokenSecretKey')!;
  }

  get refreshTokenExpirationTime(): number {
    return this.configService.get<number>('app.refreshTokenExpirationTime')!;
  }
}
