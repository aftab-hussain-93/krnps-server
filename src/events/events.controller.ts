import { Body, Controller, Get, Post, Request, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadedFile } from '@nestjs/common';
import { Express } from "express"
import { eventImageUploadOptions } from '../common/multerOptions';
import { CreateEventDto } from './dto/event.dto';
import { BadRequestException } from '@nestjs/common';
import { join } from 'path'

@ApiTags('events')
@Controller({ path: 'events', version: '1' })
export class EventsController {
    constructor(private readonly eventService: EventsService) { }
    
    @Post()
    @UseInterceptors(FileInterceptor('file', eventImageUploadOptions))
    createEvent(
        @UploadedFile() file: Express.Multer.File,
        @Body() body: CreateEventDto
    ) {
        if (!file) throw new BadRequestException()
        const { path: filePath } = file
        // const SERVER_URL = process.env.URL
        // const image = join(SERVER_URL, filePath)
        // console.log(image)
        // return image
        
        return this.eventService.create({ ...body, image: filePath }, { id: 1, isAdmin: false })
    }

    @Get()
    getAllEvents() {
        return this.eventService.findAll()
    }

    @Get('/upcoming')
    getUpcomingEvents() {
        return this.eventService.getUpcomingEvents()
    }

    @Get('/past')
    getPastEvents() {
        return this.eventService.getPastEvents()
    }
}
