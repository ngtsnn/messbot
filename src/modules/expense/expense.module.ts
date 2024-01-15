import { Module } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { PrismaModule } from '../prisma/prisma.modules';

@Module({
  imports: [PrismaModule],
  providers: [ExpenseService],
  exports: [ExpenseService],
})
export class ExpenseModule {}
