import { InjectRedis } from '@nestjs-modules/ioredis';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Redis } from 'ioredis';
import otpGenerator = require('otp-generator');
import { PrismaService } from '../prisma/prisma.service';
import { generateKeyPairSync } from 'crypto';

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
    const { privateKey, publicKey } = generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'pkcs1', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs1', format: 'pem' },
    });

    const token = this.jwtService.sign(
      { userId, deviceId },
      {
        algorithm: 'RS256',
        privateKey,
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
}
