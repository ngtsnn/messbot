import { Module } from '@nestjs/common';
import { BudgetService } from './budget.service';
import { PrismaModule } from '../prisma/prisma.modules';

@Module({
  imports: [PrismaModule],
  providers: [BudgetService],
  exports: [BudgetService],
})
export class BudgetModule {}
