import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './modules/user/user.module';
import { AppConfigService } from './config/app.config.service';
import { AuthModule } from './modules/auth/auth.module';
import { MailModule } from './mailer/mailer.module';

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    UserModule,
    AuthModule,
    MailModule,
  ],
  controllers: [],
  providers: [AppConfigService],
})
export class AppModule {}
