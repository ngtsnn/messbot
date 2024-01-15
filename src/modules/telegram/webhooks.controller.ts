import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { WebhookService } from './webhooks.service';
import { ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { TeleMessageBody } from './webhook.dto';
import TelegramBot from 'src/types/telegram';

@Controller('/telegram')
@ApiTags('Messenger Webhooks')
export class WebhookController {
  constructor(
    private readonly service: WebhookService,
    private readonly config: ConfigService,
  ) {}

  @Get('/')
  async getMessage(@Query() query: any) {
    return 'hello';
  }

  @Post('/')
  async onMessage(@Body() body: any) {
    if (body.message) {
      return await this.service.handleMessages(body?.message);
    }

    return false;
  }
}
