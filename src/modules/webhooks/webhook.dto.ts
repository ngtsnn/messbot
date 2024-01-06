import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type, } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';

export class HubQuery {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
  })
  'hub.mode': string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
  })
  'hub.verify_token': string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    type: Number,
  })
  'hub.challenge': number;
}

export class GetMessageWebhookDTO {
  // @IsNotEmpty()
  // @IsObject()
  // @ValidateNested()
  // @Type(() => HubQuery)
  hub: HubQuery;
}
