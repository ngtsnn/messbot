import { Body, Controller, Get, Post } from '@nestjs/common';
import { WebhookService } from './webhooks.service';
import { ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { TeleMessageBody } from './webhook.dto';

@Controller('/telegram')
@ApiTags('Messenger Webhooks')
export class WebhookController {
  constructor(
    private readonly service: WebhookService,
    private readonly config: ConfigService,
  ) {}

  @Get('/')
  async getMessage(@Body() body: any) {
    return 'hello';
  }

  @Post('/')
  async onMessage(@Body() body: TeleMessageBody) {
    const responseToUser = await this.service.handleCommand(body.message.text);

    this.service.sendMsgToUser({
      id: body.message.chat.id,
      text: responseToUser,
    });

    return 'hello';
  }
}
