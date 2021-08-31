import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('reports')
@Controller({ path: 'reports', version: '1' })
export class ReportsController {}
