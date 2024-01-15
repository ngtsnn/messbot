import { Module } from '@nestjs/common';
import { WebhookService } from './webhooks.service';
import { WebhookController } from './webhooks.controller';
import { BudgetModule } from '../budget/budget.module';
import { UserModule } from '../user/users.module';
import { ExpenseModule } from '../expense/expense.module';

@Module({
  imports: [UserModule, BudgetModule, ExpenseModule],
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule {}
