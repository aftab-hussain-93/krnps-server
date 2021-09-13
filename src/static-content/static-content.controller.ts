import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('static-content')
@Controller({ path: 'static-content', version: '1' })
export class StaticContentController {}
