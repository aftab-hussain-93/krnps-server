import { Injectable, Inject, LoggerService } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { CreateUserDto } from './dto/user.dto';
import { User } from './users.model';
import * as bcrypt from 'bcrypt';

const SALT_ROUNDS: number = 10

import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { first } from 'rxjs';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User) private userModel: typeof User,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
    ) { }

    path = `src.users.users.service.ts`
    
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
            if (isUserExists) {
                this.logger.log(`${this.path}:create: User with email ${data.email} already exists. Cannot create user.`)
                return {
                    status: 400,
                    message: 'User already exists.',
                    error: 'already_exists'
                }
            }
            const hash = await bcrypt.hash(password, SALT_ROUNDS);
            const user = await this.userModel.create({
                ...data,
                createdBy: loggedInUser.id,
                password: hash
            })
            if (user) {
                this.logger.log(`${this.path}:create: User ${JSON.stringify(user)} has been created.`)
                return {
                    status: 201,
                    message: `User created successfully`
                }
            }
        } catch (e) {
            this.logger.error(`${this.path}:create: Errored out while creating user.`)
            this.logger.error(e)
            return {
                status: 500,
                error: "Errored out while creating the user"
            }
        }

    }

    async toggleStatus(userId: number, loggedInUser: any): Promise<any>{
        try {
            const user = await this.userModel.findByPk(userId)
            if (user && loggedInUser.isAdmin) {
                if (user.isActive) user.isActive = false
                else user.isActive = true
                await user.save()
                return {
                    status: 200,
                    message: "Successfully updated status of user"
                }
            }
            return {
                status: 404,
                message: "Unauthorized user"
            }
        } catch (e) {
            return {
                status: 500,
                message: "Server error"
            }
        }
    }

    async getUserDetails(userId: number, loggedInUser: any): Promise<any> {
        try {
            const user = await this.userModel.findByPk(userId, { raw: true })
            if (user && loggedInUser.isAdmin) {
                const {password, ...rest} = user
                return {
                    status: 200,
                    user: rest,
                    message: 'Success'
                }
            }
            return {
                status: 404,
                message: "Unauthorized user"
            }
        } catch (e) {
            return {
                status: 500,
                message: "Server error"
            }
        }
    }

    async updateUserDetails(userId: number, body: any, loggedInUser: any): Promise<any> {
        try {
            const user = await this.userModel.findByPk(userId)
            if (user && loggedInUser.isAdmin) {
                const { password, firstName, lastName, isAdmin } = body
                if (password) {
                    const hash = await bcrypt.hash(password, SALT_ROUNDS);
                    user.password = hash
                }
                if (firstName) user.firstName = firstName
                if (lastName) user.lastName = lastName
                if (isAdmin) user.isAdmin = isAdmin
                
                this.logger.log("User is updated")

                await user.save()

                return {
                    status: 200
                }
            }
            return {
                status: 404,
                message: "Unauthorized user"
            }
        } catch (e) {
            this.logger.error(`Errored out while updating user details.`)
            this.logger.error(e)
            return {
                status: 500,
                message: "Server error"
            }
        }
    }
}
