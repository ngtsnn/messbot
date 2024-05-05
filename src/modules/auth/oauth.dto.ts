import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString, IsUrl, Min } from "class-validator";

export interface TelegramUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

export class TeleOauthBody {
  @ApiProperty({
    type: Number,
    required: true,
  })
  @Min(1)
  @IsNumber({ maxDecimalPlaces: 0, allowInfinity: false, allowNaN: false })
  @Type(() => Number)
  id: number;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  @Type(() => String)
  first_name: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  @Type(() => String)
  last_name: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  @Type(() => String)
  username: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsString()
  @IsUrl()
  @IsOptional()
  @Type(() => String)
  photo_url: string;

  @ApiProperty({
    type: Number,
    required: true,
  })
  @Min(1)
  @IsNumber({ maxDecimalPlaces: 0, allowInfinity: false, allowNaN: false })
  @Type(() => Number)
  auth_date: number;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  @Type(() => String)
  hash: string;
}
