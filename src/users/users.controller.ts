import { Body, Controller, Get, Param, Post, Request, UseGuards, Inject, LoggerService, Response } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from './users.model';
import { UsersService } from './users.service';
import { Request as RequestType, Response as ResponseType } from 'express';
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
    async create(
        @Request() req: RequestType,
        @Body() body: CreateUserDto,
        @Response() res: ResponseType
    ) {
        const loggedInUser = req.user
        this.logger.log(`Creating user. ${JSON.stringify(body)}. Logged in user ${JSON.stringify(loggedInUser)}`)
        const data = await this.userService.create(body, loggedInUser)
        res.status(data.status).json({ ...data })
    }

    @Roles(Role.Admin)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('/status/:id')
    async toggleStatus(
        @Param('id') id,
        @Request() req: RequestType,
        @Response() res: ResponseType
    ) {
        const loggedInUser = req.user
        this.logger.log(`Toggle status of user with ID. ${id}. Logged in user ${JSON.stringify(loggedInUser)}`)
        const { status, message } = await this.userService.toggleStatus(id, loggedInUser)
        res.status(status).json({
            status,
            message
        })
    }

    @Roles(Role.Admin)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('/:id')
    async getUserDetails(
        @Param('id') id,
        @Request() req: RequestType,
        @Response() res: ResponseType
    ) {
        const loggedInUser = req.user
        this.logger.log(`Getting details of user with ID. ${id}. Logged in user ${JSON.stringify(loggedInUser)}`)
        const resp = await this.userService.getUserDetails(id, loggedInUser)
        res.status(resp.status).json({...resp})
    }

    @Roles(Role.Admin)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('/:id')
    async updateUserDetails(
        @Param('id') id,
        @Request() req: RequestType,
        @Response() res: ResponseType,
        @Body() body: CreateUserDto,
    ) {
        const loggedInUser = req.user
        this.logger.log(`Updating user with ID. ${id}. Logged in user ${JSON.stringify(loggedInUser)}`)
        const resp = await this.userService.updateUserDetails(id, body, loggedInUser)
        res.status(resp.status).json({...resp})
    }
}
