import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Event } from './events.model';

import { Op } from 'sequelize';
import { CreateEventDto } from './dto/event.dto';

@Injectable()
export class EventsService {
    constructor(
        @InjectModel(Event)
        private eventModel: typeof Event
    ) { }

    async findAll(): Promise<Event[]> {
        return this.eventModel.findAll({
            where: {
                deletedAt: {
                    [Op.is]: null 
                }
            }
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
        const { eventDate, ...data } = eventData
        return this.eventModel.create({
            ...data,
            eventDate: new Date(eventDate * 1000),
            createdBy: loggedInUser.id
        })
    }
}
