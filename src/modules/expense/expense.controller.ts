import { Controller, Get, Query, Req, UseGuards, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/common/guards/jwt.strategy';
import { AuthRequest } from 'src/types';
import { ExpenseService } from './expense.service';
import { AddExpense, AddExpenseBody, ExpenseQuery } from './expense.dto';

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

  @Post('')
  async addTransaction(@Req() req: AuthRequest, @Body() body: AddExpenseBody) {
    const { user } = req;
    return await this.expenseService.addExpense({
      user,
      ...body,
    });
  }
}
