import { Injectable } from "@nestjs/common";
import { CheckSessionDto } from "./session.dto";
import { PrismaService } from "../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class SessionService {
  constructor(
    private readonly jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  public async checkSession(sessionCheck: CheckSessionDto) {
    const token = sessionCheck.refreshToken;

    try {
      const session = await this.prisma.sessions.findFirst({
        where: {
          userId: sessionCheck.userId,
          deviceId: sessionCheck.deviceId,
        },
      });
      if (!session) {
        return false;
      }
      const publicKey = session.token;

      const res = this.jwtService.verify(token, {
        secret: publicKey
      });


      return true;
    } catch (error) {
      return false;
    }
  }
}
