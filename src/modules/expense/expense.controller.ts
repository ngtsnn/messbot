import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/common/guards/jwt.strategy';
import { AuthRequest } from 'src/types';
import { ExpenseService } from './expense.service';

@Controller('/expense')
@ApiTags('Expense')
@UseGuards(JwtGuard)
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Get('')
  async getTransactions(@Req() req: AuthRequest) {
    const { user } = req;
    return await this.expenseService.getExpense({
      user
    });
  }
}
