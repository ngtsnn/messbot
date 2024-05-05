import { InjectRedis } from '@nestjs-modules/ioredis';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Redis } from 'ioredis';
import otpGenerator = require('otp-generator');
import { PrismaService } from '../prisma/prisma.service';
import nanoid = require('nanoid');
import { createHash, createHmac, generateKeyPairSync } from 'crypto';
import { TelegramUser } from './oauth.dto';

const EXPIRE = 300; // 5m
const MAGIC_KEY = 'magic_salt';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @InjectRedis() private readonly redisService: Redis,
    private prisma: PrismaService,
  ) {}

  async generateMagicToken(userId: number) {
    const secret = this.configService.get('MAGIC_SECRET', 'MAGIC_SECRET');
    const salt = otpGenerator.generate(10);

    await this.redisService.setex(
      `${MAGIC_KEY}-${userId.toString()}`,
      EXPIRE,
      salt,
    );
    const token = this.jwtService.sign(userId.toString(), {
      secret: `${secret}-${salt}`,
    });

    return token;
  }

  async verifyMagicToken(token: string) {
    try {
      const userId = this.jwtService.decode(token);
      if (typeof userId !== 'string') {
        throw new Error('userId not stored in magic');
      }
      const key = `${MAGIC_KEY}-${userId}`;
      const secret = this.configService.get('MAGIC_SECRET', 'MAGIC_SECRET');
      const salt = await this.redisService.get(key);
      const res = this.jwtService.verify(token, {
        secret: `${secret}-${salt}`,
      });
      this.redisService.del(key);
      return !!res ? +userId : false;
    } catch (error) {
      console.log('🚀 ~ AuthService ~ verifyMagicToken ~ error:', error);
      throw new BadRequestException('Token Expired');
    }
  }

  async generateRefreshToken(userId: number, deviceId: string) {
    const publicKey = nanoid.nanoid();
    const token = this.jwtService.sign(
      { userId, deviceId },
      {
        secret: publicKey,
      },
    );

    await this.prisma.sessions.upsert({
      where: {
        userId_deviceId: { userId, deviceId },
      },
      update: { token: publicKey },
      create: { userId, deviceId, token: publicKey },
    });

    return token;
  }

  generateAccessToken(userId: number) {
    const token = this.jwtService.sign(
      {
        userId: userId.toString(),
      },
      {
        secret: this.configService.get('ACCESS_SECRET', 'ACCESS_SECRET'),
      },
    );

    return token;
  }

  verifyAccesstoken(token: string) {
    try {
      const verified = this.jwtService.verify(token, {
        secret: this.configService.get('ACCESS_SECRET', 'ACCESS_SECRET'),
      });
      if (typeof verified !== 'string') {
        return false;
      }

      const userId = +verified;

      if (isNaN(userId)) {
        return false;
      }

      return userId;
    } catch (error) {
      return false;
    }
  }

  verifyTeleOauth({ hash, ...userData }: TelegramUser) {
    const BOT_KEY = this.configService.get('TELEGRAM_ACCESS_TOKEN', 'BOT_KEY');
    const secretKey = createHash('sha256').update(BOT_KEY).digest();

    // this is the data to be authenticated i.e. telegram user id, first_name, last_name etc.
    const dataCheckString = Object.keys(userData)
      .sort()
      .map((key) => `${key}=${userData[key]}`)
      .join('\n');

    // run a cryptographic hash function over the data to be authenticated and the secret
    const hmac = createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    // compare the hash that you calculate on your side (hmac) with what Telegram sends you (hash) and return the result
    return hmac === hash;
  }

  async revokeAccessToken(userId: number, deviceId: string) {
    return await this.prisma.sessions.update({
      where: { userId_deviceId: { userId, deviceId } },
      data: { token: '' },
    });
  }
}
