import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { Event } from './events.model';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    SequelizeModule.forFeature([Event]),
    ConfigModule.forRoot()
  ],
  providers: [EventsService],
  controllers: [EventsController]
})
export class EventsModule {}
