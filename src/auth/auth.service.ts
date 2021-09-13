import { Injectable, Inject, LoggerService } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { User } from '../users/users.model';

import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';


@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService
    ) { }

    path: string = `src.auth.auth.service`

    async validateUser(email: string, password: string): Promise<any> {
        this.logger.log(`${this.path} :validateUser: Validating user with email ${email}`)
        const user = await this.userService.findByEmail(email)
        if (user) {
            const isValid: boolean = await bcrypt.compare(password, user.password)
            if (isValid) {
                this.logger.log(`${this.path} User is valid. ${email}`)
                const { password, ...result } = user
                return result
            }
            this.logger.log(`${this.path} User is invalid as password is incorrect. ${email}`)
        }
        this.logger.log(`${this.path} User is invalid as user does not exist. ${email}`)
        return null
    }

    async validateAdminUser(email: string, password: string): Promise<any> {
        const user = await this.userService.findAdminByEmail(email)
        if (user) {
            const isValid: boolean = await bcrypt.compare(password, user.password)
            if (isValid) {
                const { password, ...result } = user
                return result
            }
        }
        return null
    }

    login(user: any, response: Response): Response {
        this.logger.log(`${this.path} :login: Login user- ${JSON.stringify(user)}`)
        
        const payload = { id: user.id, isAdmin: user.isAdmin }
        const expiresIn = 60 * 60 * 24 * 15; // 15 days
        response.cookie('id_token', this.jwtService.sign(payload), {
            httpOnly: true,
            sameSite: true,
            maxAge: 1000 * expiresIn,
            secure: process.env.NODE_ENV == "production"
        })
        this.logger.log(`${this.path} :login: Cookie set`)
        return response.status(200).json({
            status: 'ok'
        })
    }

    logout(response: Response): Response {
        response.clearCookie('id_token')
        return response.status(200).json({
            status: "ok"
        })
    }

    async getProfile(loggedInUser: any): Promise<User> {
        return this.userService.findOne(loggedInUser.id)
    }
}
