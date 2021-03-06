import { Body, Controller, Get, Param, Post, Request, UseGuards, UseInterceptors, LoggerService, Inject, Res, Response } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadedFile } from '@nestjs/common';
import { Express, Request as RequestType, request, Response as ResponseType } from "express"
import { reportUploadOptions } from '../common/multerOptions';
import { CreateReportDto } from './dto/reports.dto';
import { BadRequestException } from '@nestjs/common';
import { normalize } from 'path'
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@ApiTags('reports')
@Controller({ path: 'reports', version: '1' })
export class ReportsController {

    constructor(
        private readonly reportsService: ReportsService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService
    ) { }

    @Roles(Role.User)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post()
    @UseInterceptors(FileInterceptor('file', reportUploadOptions))
    async uploadReport(
        @UploadedFile() file: Express.Multer.File,
        @Body() body: CreateReportDto,
        @Request() req: RequestType,
        @Response() res: ResponseType
    ) {
        if (!file) throw new BadRequestException()
        const { path: filePath, originalname: originalName, filename: fileName, destination: folder } = file
        const loggedInUser = req.user
        this.logger.log(`Creating report record. Body - ${JSON.stringify(body)}. File path - ${filePath}`)
        const report = await this.reportsService.create({ ...body, filePath: normalize(filePath), originalName, fileName, folder }, loggedInUser)
        if (report) return res.status(201).json({ report, status: "ok" })
        return res.status(500).json({
            error: "Errored out while creating event"
        })
    }

    @Get()
    getAllReports() {
        return this.reportsService.findAll()
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('/delete/:id')
    async deleteReport(@Param('id') id, @Request() req: RequestType, @Response() res: ResponseType) {
        const loggedInUser = req.user
        const isDeleted: boolean = await this.reportsService.deleteReport(id, loggedInUser)
        if (isDeleted) return res.status(200).json({
            status: 200,
            message: 'Report deleted successfully.'
        })
        return res.status(500).json({
            status: 400,
            message: "Could not delete report"
        })
    }

}
