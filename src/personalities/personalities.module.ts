import { Module } from '@nestjs/common';
import { PersonalitiesService } from './personalities.service';
import { PersonalitiesController } from './personalities.controller';

import { SequelizeModule } from '@nestjs/sequelize';
import { Personality } from './personalities.model';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    SequelizeModule.forFeature([Personality]),
    ConfigModule.forRoot()
  ],
  providers: [PersonalitiesService],
  controllers: [PersonalitiesController]
})
export class PersonalitiesModule {}
