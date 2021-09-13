import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, Inject, LoggerService } from '@nestjs/common';
import { LoginUserDto } from '../users/dto/user.dto';
import { cookieExtractor } from './cookie-jwt-extractor';
import { UsersService } from '../users/users.service';

import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly usersService: UsersService, @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService) {
        super({
            jwtFromRequest: cookieExtractor,
            ignoreExpiration: false,
            secretOrKey: process.env.SECRET_KEY
        })
    }

    async validate(payload: any): Promise<LoginUserDto> {
        this.logger.log(`In Passport-JWT Strategy`)
        this.logger.log(`Validating user with ID. ${payload.id}`)
        const user = await this.usersService.findOne(payload.id)
        if (!user) {
            this.logger.log(`User is invalid`)
            throw new UnauthorizedException()
        }
        this.logger.log(`Valid user!`)
        return { id: payload.id, isAdmin: payload.isAdmin }
    }
}
