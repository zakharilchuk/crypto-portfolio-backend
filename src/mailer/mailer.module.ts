import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { AppConfigModule } from 'src/config/config.module';
import { MailerConfigService } from 'src/config/mailer.config.service';
import { MailerServiceImpl } from './mailer.service';
import { MAILER_SERVICE } from './mailer.interface';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [AppConfigModule],
      useFactory: (config: MailerConfigService) => {
        return {
          transport: {
            host: config.host,
            auth: {
              user: config.username,
              pass: config.password,
            },
          },
        };
      },
      inject: [MailerConfigService],
    }),
  ],
  providers: [
    {
      provide: MAILER_SERVICE,
      useClass: MailerServiceImpl,
    },
  ],
  exports: [MAILER_SERVICE],
})
export class MailModule {}
