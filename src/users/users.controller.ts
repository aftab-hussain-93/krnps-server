import { Body, Controller, Get, Param, Post, Request, UseGuards, Inject, LoggerService } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from './users.model';
import { UsersService } from './users.service';
import { Request as RequestType } from 'express';
import { CreateUserDto } from './dto/user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { RolesGuard } from '../auth/roles.guard';

//Logger
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

interface CreateUserResponse {
    status: string
}

@ApiTags('users')
@Controller({ path: 'users', version: '1' })
export class UsersController {
    constructor(
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
        private readonly userService: UsersService) { }

    @Roles(Role.User)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get()
    getUsers(): Promise<User[]> {
        this.logger.log(`Getting all users.`)
        return this.userService.findAll()
    }

    @Roles(Role.Admin)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post()
    create(
        @Request() req: RequestType,
        @Body() body: CreateUserDto
    ): Promise<CreateUserResponse> {
        const loggedInUser = req.user
        this.logger.log(`Creating user. ${JSON.stringify(body)}. Logged in user ${JSON.stringify(loggedInUser)}`)
        return this.userService.create(body, loggedInUser)
    }

    @Roles(Role.Admin)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('/delete/:id')
    delete(
        @Param('id') id,
        @Request() req: RequestType
    ) {
        const loggedInUser = req.user
        this.logger.log(`Deleting user with ID. ${id}. Logged in user ${JSON.stringify(loggedInUser)}`)
        return this.userService.deleteUser(id, loggedInUser)
    }
}
