import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Event } from './events.model';

import { Op } from 'sequelize';
import { CreateEventDto } from './dto/event.dto';
import { User } from '../users/users.model';

import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class EventsService {
    constructor(
        @InjectModel(Event) private eventModel: typeof Event,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService
    ) { }

    path = `src.events.EventsService`

    async findAll(): Promise<Event[]> {
        return this.eventModel.findAll({
            where: {
                deletedAt: {
                    [Op.is]: null 
                }
            }
        })
    }

    async findUserEvents(user: any): Promise<Event[]> {
        let where: any = {
            deletedAt: {
                [Op.is]: null
            },
        }
        if (!user.isAdmin) where = { ...where, createdBy: user.id } // return user's events if not an admin otherwise return all events
        
        return this.eventModel.findAll({
            where,
            include: [{
                model: User,
                attributes: ['firstName', 'lastName', 'email'],
                required: true
            }]
        })
    }

    async getUpcomingEvents(): Promise<Event[]> {
        return this.eventModel.findAll({
            where: {
                deletedAt: {
                    [Op.is]: null 
                },
                eventDate: {
                    [Op.gte]: new Date()
                }
            }
        })
    }

    async getUserAndEvents(): Promise<any> {
        return this.eventModel.findAll({
            where: {
                deletedAt: {
                    [Op.is]: null
                }
            },
            include: [{
                model: User,
                attributes: ['firstName', 'lastName', 'email'],
                required: true
            }]
        })
    }

    async getPastEvents(): Promise<Event[]> {
        return this.eventModel.findAll({
            where: {
                deletedAt: {
                    [Op.is]: null 
                },
                eventDate: {
                    [Op.lt]: new Date()
                }
            }
        })
    }

    async findOne(eventId: number): Promise<Event> {
        return this.eventModel.findByPk(eventId)
    }

    async create(eventData: CreateEventDto, loggedInUser: any): Promise<Event> {
        this.logger.log(`Creating event`)
        try {
            const { eventDate, ...data } = eventData
            this.logger.log(`${this.path}: Event details ${JSON.stringify(data)}`)
            return this.eventModel.create({
                ...data,
                eventDate: new Date(eventDate * 1000),
                createdBy: loggedInUser.id
            })
        } catch (e) {
            this.logger.error(`Errored out while creating event`)
            this.logger.error(e)
            return null
        }
        
    }
    
    async deleteEvent(eventId: number, loggedInUser: any): Promise<Boolean> {
        let where: any = {
            id: eventId
        }
        if (!loggedInUser.isAdmin) where = { ...where, createdBy: loggedInUser.id }
        this.logger.log(`${this.path}: Deleting event. ${eventId}`)
        
        const event = await this.eventModel.findOne({
            where
        })
        if (event) {
            event.deletedAt = new Date(Date.now())
            await event.save()
            return true
        }
        return false
    }
}
