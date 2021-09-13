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
        private userModel: typeof User
    ) { }
    
    async findAll(): Promise<User[]>{
        return this.userModel.findAll({ raw: true })
    }

    async findOne(userId: number): Promise<User>{
        return this.userModel.findOne({
            where: {
                id: userId,
                isActive: true
            },
            raw: true
        })
    }

    async findByEmail(email: string): Promise<any>{
        return this.userModel.findOne({
            where: {
                email,
                isActive: true
            },
            raw: true
        })
    }

    async findAdminByEmail(email: string): Promise<any>{
        return this.userModel.findOne({
            where: {
                email,
                isAdmin: true,
                isActive: true
            },
            raw: true
        })
    }

    async create(payload: CreateUserDto, loggedInUser: any): Promise<any>{
        const { password, ...data } = payload
        try {
            const isUserExists = await this.userModel.findOne({
                where: {
                    email: data.email
                }
            })
            if (isUserExists) return {
                status: "user"
            }
            const hash = await bcrypt.hash(password, SALT_ROUNDS);
            const user = await this.userModel.create({
                ...data,
                createdBy: loggedInUser.id,
                password: hash
            })
            if (user) return {
                status: "ok"
            }
        } catch (e) {
            console.error(`Errored out while creating user.`)
            console.error(e)
            return {
                error: "Errored out while creating the user"
            }
        }

    }

    async deleteUser(userId, loggedInUser: any): Promise<any>{
        const user = await this.userModel.findByPk(userId)
        if (user && loggedInUser.isAdmin) {
            user.isActive = false
            await user.save()
            return {
                status: "ok"
            }
        }
        
        return {
            error: "Invalid logged in user"
        }
    }
}
