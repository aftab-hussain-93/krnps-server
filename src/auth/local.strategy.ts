import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException, Inject, LoggerService } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginUserDto } from "../users/dto/user.dto";

import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService, @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService) {
        super({ usernameField: 'email' })
    }

    async validate(email: string, password: string): Promise<LoginUserDto>{
        this.logger.log(`In Passport - Local Strategy`)
        this.logger.log(`Validating user with email ${email}`)
        const user = await this.authService.validateUser(email, password);
        if (!user) {
            this.logger.log(`User is invalid`)
            throw new UnauthorizedException();
        }
        this.logger.log(`User is valid`)
        return user;
    }
}