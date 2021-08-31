import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('static')
@Controller({ path: 'static-content', version: '1' })
export class StaticContentController {}
