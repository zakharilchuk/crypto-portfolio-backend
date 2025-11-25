import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppConfigService } from './app.config.service';
import { validationSchema } from './validation';
import configuration from './configuration';
import { DatabaseConfigService } from './database.config.service';
import { MailerConfigService } from './mailer.config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
    }),
  ],
  providers: [
    AppConfigService,
    ConfigService,
    DatabaseConfigService,
    MailerConfigService,
  ],
  exports: [AppConfigService, DatabaseConfigService, MailerConfigService],
})
export class AppConfigModule {}
