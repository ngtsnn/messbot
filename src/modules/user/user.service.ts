import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as Joi from 'joi';
import { CreateUserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(params: CreateUserDto) {
    const schema = Joi.object({
      id: Joi.number().required(),
      first_name: Joi.string().optional(),
      last_name: Joi.string().optional(),
      language_code: Joi.string().optional(),
    });

    const { error } = schema.validate(params);

    if (error) {
      throw new SyntaxError(error.message);
    }

    try {
      const now = new Date();
      const b = await this.prisma.user.upsert({
        create: {
          ...params,
          createdAt: now,
          updatedAt: now,
        },
        where: {
          id: params.id,
        },
        update: {},
      });
      return b;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
