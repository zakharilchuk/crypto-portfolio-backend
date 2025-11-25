import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from 'src/config/config.module';
import { DatabaseConfigService } from 'src/config/database.config.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [DatabaseConfigService],
      useFactory: (config: DatabaseConfigService) => ({
        type: 'postgres',
        host: config.host,
        port: config.port,
        username: config.user,
        password: config.password,
        database: config.name,
        autoLoadEntities: true,
        logging: true,
        synchronize: true,
      }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
