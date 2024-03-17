import { Module } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { ExpenseController } from './expense.controller';
import { PrismaModule } from '../prisma/prisma.modules';

@Module({
  imports: [PrismaModule],
  providers: [ExpenseService],
  exports: [ExpenseService],
  controllers: [ExpenseController]
})
export class ExpenseModule {}
