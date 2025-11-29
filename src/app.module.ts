import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './modules/user/user.module';
import { AppConfigService } from './config/app.config.service';
import { AuthModule } from './modules/auth/auth.module';
import { MailModule } from './mailer/mailer.module';
import { PortfolioModule } from './modules/portfolio/portfolio.module';

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    UserModule,
    AuthModule,
    MailModule,
    PortfolioModule,
  ],
  controllers: [],
  providers: [AppConfigService],
})
export class AppModule {}
