import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { ISendMessage } from './webhook.dto';
import { MSG_TEMPLATE } from 'src/common/constant/chat';
import ejs = require('ejs');

@Injectable()
export class WebhookService {
  private http: AxiosInstance;
  private commandRegex = /^\s*\/(\w+)(?:\s+(\w+))*\s*$/;

  constructor(private readonly config: ConfigService) {
    const botToken = config.get(
      'TELEGRAM_ACCESS_TOKEN',
      'TELEGRAM_ACCESS_TOKEN',
    );

    this.http = axios.create({
      baseURL: `https://api.telegram.org/bot${botToken}`,
    });
    this.http.interceptors.response.use((res) => {
      const { data } = res;
      return data;
    });
  }

  async sendMsgToUser(msg: ISendMessage) {
    try {
      const res = await this.http.post('sendMessage', {
        chat_id: msg.id,
        text: msg.text,
        parse_mode: 'Markdown',
      });

      return res;
    } catch (error) {
      console.log('🚀 ~ WebhookService ~ sendMsgToUser ~ error:', error);

      return false;
    }
  }

  async handleCommand(msg: string) {
    if (!this.commandRegex.test(msg)) {
      return MSG_TEMPLATE.FALLBACK;
    }

    const { action, params } = this.commandSpliting(msg);

    switch (action) {
      case 'start': {
        return MSG_TEMPLATE.WELLCOME;
      }
      case 'help': {
        return MSG_TEMPLATE.HELP;
      }

      default: {
        return MSG_TEMPLATE.FALLBACK;
      }
    }
  }

  private commandSpliting(command: string) {
    const match = this.commandRegex.exec(command);

    if (match) {
      const action = match[1].trim(); // The command/action without leading or trailing whitespace
      const params = match[2]
        ? match[2].split(',').map((param) => param.trim())
        : []; // Parameters without leading or trailing whitespace, if any

      console.log('Action:', action);
      console.log('Parameters:', params);
      return { action, params };
    } else {
      return { action: '', params: [] };
    }
  }
}
