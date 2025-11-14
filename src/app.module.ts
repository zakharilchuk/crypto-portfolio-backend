import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { AppConfigService } from './config/config.service';

@Module({
  imports: [AppConfigModule, DatabaseModule],
  controllers: [],
  providers: [AppConfigService],
})
export class AppModule {}
