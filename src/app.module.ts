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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
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
