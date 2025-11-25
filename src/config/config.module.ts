import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppConfigService } from './app.config.service';
import { validationSchema } from './validation';
import configuration from './configuration';
import { DatabaseConfigService } from './database.config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
    }),
  ],
  providers: [AppConfigService, ConfigService, DatabaseConfigService],
  exports: [AppConfigService, DatabaseConfigService],
})
export class AppConfigModule {}
