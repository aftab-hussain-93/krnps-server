import { Module } from '@nestjs/common';
// Sequelize
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './users.model';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [SequelizeModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, SequelizeModule]
})
export class UsersModule { }
