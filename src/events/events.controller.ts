import { Body, Controller, Get, Param, Post, Request, UseGuards, UseInterceptors, LoggerService, Inject, Res, Response  } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadedFile } from '@nestjs/common';
import { Express, Request as RequestType, request, Response as ResponseType } from "express"
import { eventImageUploadOptions } from '../common/multerOptions';
import { CreateEventDto } from './dto/event.dto';
import { BadRequestException } from '@nestjs/common';
import { normalize } from 'path'
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@ApiTags('events')
@Controller({ path: 'events', version: '1' })
export class EventsController {
    constructor(
        private readonly eventService: EventsService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService
    ) { }

    @Roles(Role.User)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post()
    @UseInterceptors(FileInterceptor('file', eventImageUploadOptions))
    async createEvent(
        @UploadedFile() file: Express.Multer.File,
        @Body() body: CreateEventDto,
        @Request() req: RequestType,
        @Response() res: ResponseType
    ) {
        if (!file) throw new BadRequestException()
        const { path: filePath } = file
        const loggedInUser = req.user
        this.logger.log(`Creating event. ${JSON.stringify(body)}`)
        const event = await this.eventService.create({ ...body, image: normalize(filePath) }, loggedInUser)
        if (event) return res.status(201).json({ event, status: "ok" })
        return res.status(500).json({
            error: "Errored out while creating event"
        })
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('/user')
    async getUserEvents(
        @Request() req: RequestType
    ) {
        const loggedInUser = req.user
        return this.eventService.findUserEvents(loggedInUser)
    }

    @Get()
    getAllEvents() {
        return this.eventService.findAll()
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('/delete/:id')
    async deleteEvent(@Param('id') id, @Request() req: RequestType, @Response() res: ResponseType) {
        const loggedInUser = req.user
        const isDeleted = await this.eventService.deleteEvent(id, loggedInUser)
        if (isDeleted) return res.status(200).json({
            status: "ok"
        })
        return res.status(500).json({
            error: "No such event exists",
            message: "Could not delete error"
        })
    }

    @Get('/users')
    getEventsAndUsers() {
        return this.eventService.getUserAndEvents()
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
