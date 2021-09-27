import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Report } from './reports.model';

import { Op } from 'sequelize';
import { User } from '../users/users.model';

import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class ReportsService {
    constructor(
        @InjectModel(Report) private reportModel: typeof Report,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService
    ) { }

    path = `src.reports.ReportsService`

    async create(reportData: any, loggedInUser: any): Promise<Report> {
        this.logger.log(`Uploading report`)
        try {
            return this.reportModel.create({
                ...reportData,
                createdBy: loggedInUser.id
            })
        } catch (e) {
            this.logger.error(`Errored out while creating report ${JSON.stringify(reportData)}`)
            this.logger.error(e)
            return null
        }
    }

    async findAll(): Promise<Report[]> {
        return this.reportModel.findAll({
            where: {
                deletedAt: {
                    [Op.is]: null
                }
            }
        })
    }

    async deleteReport(reportId: number, loggedInUser: any): Promise<boolean> {
        let where: any = {
            id: reportId,
            deletedAt: {
                [Op.is]: null
            }
        }
        if (!loggedInUser.isAdmin) where = { ...where, createdBy: loggedInUser.id }
        this.logger.log(`${this.path}: Deleting report. ${reportId}`)
        try {
            const report = await this.reportModel.findOne({
                where
            })
            if (!report) throw new Error(`No such report found`)
            report.deletedAt = new Date(Date.now())
            await report.save()
            return true
        } catch (e) {
            this.logger.error(`${this.path}:deleteReport: Report could not be deleted. Logged in user ${JSON.stringify(loggedInUser)}`)
            this.logger.error(e)
            return false
        }
    }
}
