// Nest
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
//Database
import { SequelizeModule } from '@nestjs/sequelize';

//Custom Modules
import { UsersModule } from './users/users.module';
import { EventsModule } from './events/events.module';
import { ReportsModule } from './reports/reports.module';
import { StaticContentModule } from './static-content/static-content.module';
import { AuthModule } from './auth/auth.module';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: './error.log', level: 'error' }),
        new winston.transports.File({ filename: './logs/combined.log' }),
      ],
    }),
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_USER,
      password: process.env.DB_PWD,
      database: process.env.DB_NAME,
      autoLoadModels: true,
      synchronize: true,
      logging: false,
      timezone: "+00:00", // UTC Timezone for reading and writing
      define: {
        freezeTableName: true,
        underscored: true,
        timestamps: false
      }
    }),
    UsersModule, EventsModule, ReportsModule, StaticContentModule, AuthModule]
})

export class AppModule { }
