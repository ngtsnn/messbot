import { Module } from '@nestjs/common';
import { WebhookService } from './webhooks.service';
import { WebhookController } from './webhooks.controller';

@Module({
  imports: [],
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule {}
