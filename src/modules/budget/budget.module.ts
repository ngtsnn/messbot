import { Module } from '@nestjs/common';
import { BudgetService } from './budget.service';
import { PrismaModule } from '../prisma/prisma.modules';
import { BudgetController } from './budget.controller';

@Module({
  imports: [PrismaModule],
  providers: [BudgetService],
  exports: [BudgetService],
  controllers: [BudgetController]
})
export class BudgetModule {}
