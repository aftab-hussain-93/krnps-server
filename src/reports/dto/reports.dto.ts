import { IsNotEmpty } from 'class-validator';
import { reportTypes } from '../reports.model'


export class CreateReportDto {
    @IsNotEmpty()
    fileType: reportTypes;
}
