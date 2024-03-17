import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/common/guards/jwt.strategy';
import { AuthRequest } from 'src/types';
import { BudgetService } from './budget.service';

@Controller('/budget')
@ApiTags('Budget')
@UseGuards(JwtGuard)
export class BudgetController {

  constructor(
    private readonly budgetService: BudgetService
  ) {

  }

  @Get('')
  async getBudget(@Req() req: AuthRequest) {
    const { user } = req;
    return await this.budgetService.getBudgetByUser(user);

  }

}
