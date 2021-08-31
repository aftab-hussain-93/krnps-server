import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService
    ) { }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.userService.findByEmail(email)
        if (user) {
            const isValid: boolean = await bcrypt.compare(password, user.password)
            if (isValid) {
                const { password, ...result } = user
                return result
            }
        }
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

    async login(user: any) {
        const payload = { id: user.id, isAdmin: user.isAdmin }

        return {
            accessToken: this.jwtService.sign(payload)
        }
    }
}
