import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/common/guards/jwt.strategy';
import { AuthRequest } from 'src/types';
import { ExpenseService } from './expense.service';
import { ExpenseQuery } from './expense.dto';

@Controller('/expense')
@ApiTags('Expense')
@UseGuards(JwtGuard)
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Get('')
  async getTransactions(@Req() req: AuthRequest, @Query() query: ExpenseQuery) {
    const { user } = req;
    return await this.expenseService.getExpense({
      user,
      ...query,
    });
  }
}
