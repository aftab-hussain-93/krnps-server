import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from './users.model';
import { UsersService } from './users.service';
import { Request as RequestType } from 'express';
import { CreateUserDto } from './dto/user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { RolesGuard } from '../auth/roles.guard';

@ApiTags('users')
@Controller({ path: 'users', version: '1' })
export class UsersController {
    constructor(private readonly userService: UsersService) { }
    
    @Roles(Role.User)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get()
    getUsers(): Promise<User[]> {
        return this.userService.findAll()
    }

    @Roles(Role.Admin)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post()
    create(
        @Request() req: RequestType,
        @Body() body: CreateUserDto
    ): Promise<User> {
        const loggedInUser = req.user
        return this.userService.create(body, loggedInUser)
    }
}
