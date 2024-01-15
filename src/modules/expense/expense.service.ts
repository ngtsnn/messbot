import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as Joi from 'joi';
import { AddExpense } from './expense.dto';

@Injectable()
export class ExpenseService {
  constructor(private prisma: PrismaService) {}

  async addExpense(params: AddExpense) {
    const schema = Joi.object({
      user: Joi.number().required(),
      category: Joi.string().required(),
      amount: Joi.number().min(0).required(),
      product: Joi.string().optional(),
    });

    const { error } = schema.validate(params);

    if (error) {
      throw new SyntaxError(error.message);
    }

    try {
      const now = new Date();
      const budget = await this.prisma.budget.findFirst({
        where: {
          userId: params.user,
          category: params.category,
        },
      });
      if (!budget) {
        throw new BadRequestException('met qua');
      }

      const b = await this.prisma.expenses.create({
        data: {
          userId: params.user,
          budgetId: budget.id,
          amount: params.amount,
          createdAt: now,
          updatedAt: now,
        },
      });
      return b;
    } catch (error) {
      console.log('🚀 ~ ExpenseService ~ addExpense ~ error:', error);
      throw new InternalServerErrorException();
    }
  }
}
