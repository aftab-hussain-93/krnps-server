import { Body, Controller, Delete, Get, Param, Post, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadedFile } from '@nestjs/common';
import { Express, Request as RequestType, request } from "express"
import { eventImageUploadOptions } from '../common/multerOptions';
import { CreateEventDto } from './dto/event.dto';
import { BadRequestException } from '@nestjs/common';
import { normalize } from 'path'
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@ApiTags('events')
@Controller({ path: 'events', version: '1' })
export class EventsController {
    constructor(private readonly eventService: EventsService) { }

    @Roles(Role.User)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post()
    @UseInterceptors(FileInterceptor('file', eventImageUploadOptions))
    createEvent(
        @UploadedFile() file: Express.Multer.File,
        @Body() body: CreateEventDto,
        @Request() req: RequestType
    ) {
        if (!file) throw new BadRequestException()
        const { path: filePath } = file
        const loggedInUser = req.user
        return this.eventService.create({ ...body, image: normalize(filePath) }, loggedInUser)
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('/user')
    getUserEvents(
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
    deleteEvent(@Param('id') id, @Request() req: RequestType) {
        const loggedInUser = req.user
        const isDeleted = this.eventService.deleteEvent(id, loggedInUser)
        if (isDeleted) return {
            status: "ok"
        }
        return {
            error: "No such event exists"
        }
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
