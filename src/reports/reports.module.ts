import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';

import { SequelizeModule } from '@nestjs/sequelize';
import { Report } from './reports.model';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    SequelizeModule.forFeature([Report]),    
    ConfigModule.forRoot()
  ],
  providers: [ReportsService],
  controllers: [ReportsController]
})
export class ReportsModule {}
