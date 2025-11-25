import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { AppConfigModule } from 'src/config/config.module';
import { AppConfigService } from 'src/config/config.service';
import { MailerServiceImpl } from './mailer.service';
import { MAILER_SERVICE } from './mailer.interface';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [AppConfigModule],
      useFactory: (appConfigService: AppConfigService) => {
        return {
          transport: {
            host: appConfigService.emailHost,
            auth: {
              user: appConfigService.emailUsername,
              pass: appConfigService.emailPassword,
            },
          },
        };
      },
      inject: [AppConfigService],
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
