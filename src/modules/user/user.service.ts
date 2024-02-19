import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as Joi from 'joi';
import { CreateUserDto, User } from './user.dto';
import { Redis } from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    @InjectRedis() private readonly redisService: Redis,
  ) {}

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

      const userId = b.id.toString();
      this.redisService.del(`users:${userId}`);
      return b;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getOne(userId: number): Promise<User | null> {
    try {
      const cached = await this.redisService.get(`users:${userId}`);
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch (error) {}
      }

      const user = await this.prisma.user.findFirst({
        where: {
          id: userId,
        },
      });
      Object.assign(user, { id: userId });
      this.redisService.setex(`users:${userId}`, 86400, JSON.stringify(user));

      return user as User;
    } catch (error) {
      return null;
    }
  }
}
