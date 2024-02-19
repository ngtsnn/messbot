import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl } from 'class-validator';

export class VerifyMagicBody {
  @ApiProperty({
    type: String,
    required: true
  })
  @IsString()
  token: string;

  // @ApiProperty({
  //   type: String,
  //   required: false,
  // })
  // @IsOptional()
  // @IsString()
  // @IsUrl()
  // redirect?: string;
}