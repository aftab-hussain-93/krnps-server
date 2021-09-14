import { ApiTags } from '@nestjs/swagger';
import { Request as RequestType, Response } from 'express';
import { Controller, Get, Post, Request, Res, UseGuards, LoggerService, Inject } from '@nestjs/common';

import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UsersService } from '../users/users.service';

import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@ApiTags('auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {

    constructor(
        private readonly authService: AuthService,
        private readonly userService: UsersService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService) { }

    @UseGuards(LocalAuthGuard)
    @Post('/login')
    async login(@Request() req: RequestType, @Res() res: Response) {
        this.logger.log(`Logging in. User - ${JSON.stringify(req.user)}`)
        return this.authService.login(req.user, res)
    }

    @Get('/logout')
    async logout(@Res() res: Response) {
        return this.authService.logout(res)
    }

    @UseGuards(JwtAuthGuard)
    @Get('/profile')
    async profile(@Request() req: RequestType, @Res() res: Response) {
        this.logger.log(`Getting Profile. User - ${JSON.stringify(req.user)}`)
        const user = await this.authService.getProfile(req.user)
        if (user) {
            const { password, ...rest } = user
            return res.status(200).json({
                status: 200,
                user: rest
            })
        }
        this.logger.error(`User Profile not found`)
        return res.status(404).json({
            status: 404,
            error: 'Not found',
            message: 'User not found'
        })
    }
}
