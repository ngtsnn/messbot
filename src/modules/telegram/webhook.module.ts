import { Module } from '@nestjs/common';
import { WebhookService } from './webhooks.service';
import { WebhookController } from './webhooks.controller';
import { BudgetModule } from '../budget/budget.module';
import { UserModule } from '../user/users.module';
import { ExpenseModule } from '../expense/expense.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [UserModule, BudgetModule, ExpenseModule, AuthModule],
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule {}
