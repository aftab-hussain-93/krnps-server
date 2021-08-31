import { Module } from '@nestjs/common';
import { StaticContentService } from './static-content.service';
import { StaticContentController } from './static-content.controller';

@Module({
  providers: [StaticContentService],
  controllers: [StaticContentController]
})
export class StaticContentModule {}
