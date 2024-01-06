import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Post,
  Query,
} from '@nestjs/common';
import { WebhookService } from './webhooks.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetMessageWebhookDTO, HubQuery } from './webhook.dto';
import { ConfigService } from '@nestjs/config';

@Controller('/webhooks')
@ApiTags('Messenger Webhooks')
export class WebhookController {
  constructor(
    private readonly service: WebhookService,
    private readonly config: ConfigService,
  ) {}

  @Get('/')
  async getMessage(@Query() query: HubQuery) {
    const {
      'hub.challenge': challenge,
      'hub.mode': mode,
      'hub.verify_token': token,
    } = query;

    const VERIFY_TOKEN = this.config.get('FACEBOOK_ACCESS_TOKEN', 'token');

    // Check if a token and mode is in the query string of the request
    if (mode && token) {
      // Check the mode and token sent is correct
      if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        // Respond with the challenge token from the request
        console.log('WEBHOOK_VERIFIED');
        return challenge;
      } else {
        // Respond with '403 Forbidden' if verify tokens do not match
        throw new ForbiddenException();
      }
    }
  }

  @Post('/')
  async subcribeNoti(@Body() body: any) {
    console.log(`\u{1F7EA} Received webhook:`);
    console.dir(body, { depth: null });

    if (body.object === 'page') {
      return 'EVENT_RECEIVED';
    }

    throw new NotFoundException('Not found');
  }
}
