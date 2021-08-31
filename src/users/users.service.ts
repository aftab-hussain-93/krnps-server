import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { CreateUserDto } from './dto/user.dto';
import { User } from './users.model';
import * as bcrypt from 'bcrypt';

const SALT_ROUNDS: number = 10

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User)
        private userModel: typeof User,
        private sequelize: Sequelize
    ) { }
    
    async findAll(): Promise<User[]>{
        return this.userModel.findAll({ raw: true })
    }

    async findOne(userId: number): Promise<User>{
        return this.userModel.findByPk(userId, { raw: true })
    }

    async findByEmail(email: string): Promise<User>{
        return this.userModel.findOne({
            attributes: ['isAdmin', 'id', 'password'],
            where: {
                email
            },
            raw: true
        })
    }

    async findAdminByEmail(email: string): Promise<any>{
        return this.userModel.findOne({
            attributes: ['isAdmin', 'id', 'password'],
            where: {
                email,
                isAdmin: true
            },
            raw: true
        })
    }

    async create(payload: CreateUserDto, loggedInUser: any): Promise<User>{
        const { password, ...data } = payload
        const hash = await bcrypt.hash(password, SALT_ROUNDS);
        
        return this.userModel.create({
            ...data,
            createdBy: loggedInUser.id,
            password: hash
        })
    }
}
