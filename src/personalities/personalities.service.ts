import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Personality } from './personalities.model';

import { Op } from 'sequelize';
import { User } from '../users/users.model';

import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class PersonalitiesService {
    constructor(
        @InjectModel(Personality) private personalitiesModel: typeof Personality,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService
    ) { }

    path = `src.personalities.PersonalitiesService`

    async create(personalityData: any, loggedInUser: any): Promise<Personality> {
        this.logger.log(`Creating personality record`)
        try {
            return this.personalitiesModel.create({
                ...personalityData,
                createdBy: loggedInUser.id
            })
        } catch (e) {
            this.logger.error(`Errored out while creating report ${JSON.stringify(personalityData)}`)
            this.logger.error(e)
            return null
        }
    }

    async findAll(): Promise<Personality[]> {
        return this.personalitiesModel.findAll({
            where: {
                deletedAt: {
                    [Op.is]: null
                }
            }
        })
    }

    async delete(id: number, loggedInUser: any): Promise<boolean> {
        let where: any = {
            id: id,
            deletedAt: {
                [Op.is]: null
            }
        }
        if (!loggedInUser.isAdmin) where = { ...where, createdBy: loggedInUser.id }
        this.logger.log(`${this.path}: Deleting personality. ${id}`)
        try {
            const personality = await this.personalitiesModel.findOne({
                where
            })
            if (!personality) throw new Error(`No such personality found`)
            personality.deletedAt = new Date(Date.now())
            await personality.save()
            return true
        } catch (e) {
            this.logger.error(`${this.path}:delete: Personality could not be deleted. Logged in user ${JSON.stringify(loggedInUser)}`)
            this.logger.error(e)
            return false
        }
    }
}
