import { ApiTags } from '@nestjs/swagger';
import { Request as RequestType } from 'express';
import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';

import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @UseGuards(LocalAuthGuard)
    @Post('/login')
    async login(@Request() req: RequestType, @Body() body: any) {
        return this.authService.login(req.user)
    }
}
