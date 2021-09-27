import { Body, Controller, Get, Param, Post, Request, UseGuards, UseInterceptors, LoggerService, Inject, Res, Response } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PersonalitiesService } from './personalities.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadedFile } from '@nestjs/common';
import { Express, Request as RequestType, request, Response as ResponseType } from "express"
import { avatarUploadOptions } from '../common/multerOptions';
import { CreatePersonalityDto } from './dto/personalities.dto';
import { BadRequestException } from '@nestjs/common';
import { normalize } from 'path'
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@ApiTags('personalities')
@Controller({ path: 'personalities', version: '1' })
export class PersonalitiesController {

    constructor(
        private readonly personalitiesService: PersonalitiesService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService
    ) { }

    @Roles(Role.User)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post()
    @UseInterceptors(FileInterceptor('file', avatarUploadOptions))
    async createPersonality(
        @UploadedFile() file: Express.Multer.File,
        @Body() body: CreatePersonalityDto,
        @Request() req: RequestType,
        @Response() res: ResponseType
    ) {
        if (!file) throw new BadRequestException()
        const { filename: fileName } = file
        const loggedInUser = req.user
        this.logger.log(`Creating personality record. Body - ${JSON.stringify(body)}. File name - ${fileName}`)
        const personality = await this.personalitiesService.create({ ...body, image: fileName }, loggedInUser)
        if (personality) return res.status(201).json({ personality, status: "ok" })
        return res.status(500).json({
            error: "Errored out while creating personality"
        })
    }

    @Get()
    findAll() {
        return this.personalitiesService.findAll()
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('/delete/:id')
    async deleteReport(@Param('id') id, @Request() req: RequestType, @Response() res: ResponseType) {
        const loggedInUser = req.user
        const isDeleted: boolean = await this.personalitiesService.delete(id, loggedInUser)
        if (isDeleted) return res.status(200).json({
            status: 200,
            message: 'Personality deleted successfully.'
        })
        return res.status(500).json({
            status: 400,
            message: "Could not delete personality"
        })
    }
}
