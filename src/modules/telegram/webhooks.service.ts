import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { ISendMessage } from './webhook.dto';
import { MSG_TEMPLATE } from 'src/common/constant/chat';
import { SendMessageOptions } from 'src/types/telegram';
import TelegramBot = require('src/types/telegram');
import { AddBudget } from '../budget/budget.dto';
import { BudgetService } from '../budget/budget.service';
import { UserService } from '../user/user.service';
import { AddExpense } from '../expense/expense.dto';
import { ExpenseService } from '../expense/expense.service';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class WebhookService {
  private http: AxiosInstance;
  private commandRegex = /^\/(\w+)(?:\s+(.*))?$/;

  constructor(
    private readonly config: ConfigService,
    private budgetService: BudgetService,
    private expenseService: ExpenseService,
    private userService: UserService,
    private authService: AuthService,
  ) {
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

  async handleMessages(message: TelegramBot.Message) {
    const msg = message?.text ?? '';
    const chatId = message?.chat?.id;
    const user = message?.from;
    const userId = message?.from?.id;
    if (!chatId) {
      return false;
    }

    if (!this.commandRegex.test(msg)) {
      return await this.fallback(chatId);
    }

    const { action, params } = this.commandSpliting(msg);

    switch (action) {
      case 'start': {
        return await this.welcome(chatId);
      }
      case 'help': {
        return await this.help(chatId);
      }

      case 'budget': {
        const category = params?.[0];
        const amount = params?.[1] ? +params?.[1] : -1;
        this.userService.createUser({
          id: userId,
          first_name: user.first_name,
          last_name: user.last_name,
          language_code: user.language_code,
        });
        return await this.addBudget(chatId, {
          amount,
          category: category,
          user: userId,
        });
      }

      case 'expenses': {
        console.log('expenses   aaaa');
        const category = params?.[0];
        const amount = params?.[1] ? +params?.[1] : -1;
        const product = params?.[2];
        return await this.addExpense(chatId, {
          amount,
          category: category,
          user: userId,
          product,
        });
      }

      case 'login': {
        this.userService.createUser({
          id: userId,
          first_name: user.first_name,
          last_name: user.last_name,
          language_code: user.language_code,
        });
        return await this.login(chatId, userId);
      }

      default: {
        return await this.fallback(chatId);
      }
    }
  }

  async sendMsgToUser(msg: ISendMessage, options?: SendMessageOptions) {
    try {
      const res = await this.http.post('sendMessage', {
        chat_id: msg.id,
        text: msg.text,
        parse_mode: options?.parse_mode,
        reply_markup: options?.reply_markup,
      });

      return res;
    } catch (error) {
      console.log(
        '🚀 ~ WebhookService ~ sendMsgToUser ~ error:',
        error.message,
      );
      return false;
    }
  }

  private commandSpliting(command: string) {
    const match = this.commandRegex.exec(command);

    if (match) {
      const action = match[1].trim(); // The command/action without leading or trailing whitespace
      const params = match[2]
        ? match[2].split(' ').map((param) => param.trim())
        : []; // Parameters without leading or trailing whitespace, if any

      console.log('Action:', action);
      console.log('Parameters:', params);
      return { action, params };
    } else {
      return { action: '', params: [] };
    }
  }

  private async fallback(chatId: number) {
    await this.sendMsgToUser(
      {
        id: chatId,
        text: MSG_TEMPLATE.FALLBACK,
      },
      {
        parse_mode: 'Markdown',
      },
    );
    return true;
  }

  private async welcome(chatId: number) {
    await this.sendMsgToUser(
      {
        id: chatId,
        text: MSG_TEMPLATE.WELCOME,
      },
      {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              { text: 'Option 1', callback_data: '1' },
              { text: 'Option 2', callback_data: '2' },
            ],
          ],
        },
      },
    );
    return true;
  }

  private async help(chatId: number) {
    await this.sendMsgToUser(
      {
        id: chatId,
        text: MSG_TEMPLATE.HELP,
      },
      {
        parse_mode: 'Markdown',
      },
    );
    return true;
  }

  private async syntaxError(chatId: number) {
    await this.sendMsgToUser(
      {
        id: chatId,
        text: MSG_TEMPLATE.SYNTAX_ERROR,
      },
      {
        parse_mode: 'Markdown',
      },
    );
    return false;
  }

  private async serverError(chatId: number) {
    await this.sendMsgToUser(
      {
        id: chatId,
        text: MSG_TEMPLATE.INTERNAL_SERVER_ERROR,
      },
      {
        parse_mode: 'Markdown',
      },
    );
    return false;
  }

  private async login(chatId: number, userId: number) {
    try {
      const token = await this.authService.generateMagicToken(userId);

      await this.sendMsgToUser(
        {
          id: chatId,
          text: `🔑 Click [here](${process.env.API_URL}/auth/magic?token=${token}) to login
Happy browsing! 🚀
          `,
        },
        {
          parse_mode: 'Markdown',
        },
      );
    } catch (error) {
      console.log('🚀 ~ WebhookService ~ login ~ error:', error);
      return await this.serverError(chatId);
    }
  }

  private async addBudget(chatId: number, params: AddBudget) {
    try {
      const b = await this.budgetService.addBudget(params);
      await this.sendMsgToUser(
        {
          id: chatId,
          text: MSG_TEMPLATE.BUDGET_SUCCESS,
        },
        {
          parse_mode: 'Markdown',
        },
      );
      return true;
    } catch (error) {
      const msg = error?.message ?? '';
      if (msg === 'Internal Server Error') {
        return await this.serverError(chatId);
      } else {
        return await this.syntaxError(chatId);
      }
    }
  }

  private async addExpense(chatId: number, params: AddExpense) {
    try {
      await this.expenseService.addExpense(params);
      await this.sendMsgToUser(
        {
          id: chatId,
          text: MSG_TEMPLATE.EXPENSE_SUCCESS,
        },
        {
          parse_mode: 'Markdown',
        },
      );
      return true;
    } catch (error) {
      const msg = error?.message ?? '';
      if (msg === 'Internal Server Error') {
        return await this.serverError(chatId);
      } else {
        return await this.syntaxError(chatId);
      }
    }
  }
}
