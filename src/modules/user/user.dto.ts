import { Prisma, User as UserReturn } from '@prisma/client';

export type CreateUserDto = {
  id: number;
  first_name?: string;
  last_name?: string;
  language_code?: string;
};

export type User = UserReturn & { id: number };
