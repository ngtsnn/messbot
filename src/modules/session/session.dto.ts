export class SessionDto {
  deviceId: string;
  userId: number;
  refreshToken: string;
}

export type CheckSessionDto = SessionDto;
export type RevokeSessionDto = Omit<SessionDto, 'refreshToken'>;
export type ExtendSessionDto = Omit<SessionDto, 'refreshToken'>;
