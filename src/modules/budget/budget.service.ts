import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as Joi from 'joi';
import { AddBudget } from './budget.dto';

@Injectable()
export class BudgetService {
  constructor(private prisma: PrismaService) {}

  async addBudget(params: AddBudget) {
    const schema = Joi.object({
      user: Joi.number().required(),
      category: Joi.string().required(),
      amount: Joi.number().min(0).required(),
    });

    const { error } = schema.validate(params);

    if (error) {
      throw new SyntaxError(error.message);
    }

    try {
      const now = new Date();
      const b = await this.prisma.budget.create({
        data: {
          userId: params.user,
          category: params.category,
          amount: params.amount,
          createdAt: now,
          updatedAt: now,
          period: 'M',
        },
      });
      return b;
    } catch (error) {
      console.log('🚀 ~ BudgetService ~ addBudget ~ error:', error);
      throw new InternalServerErrorException();
    }
  }
}
