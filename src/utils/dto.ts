import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class HasPagination {
  @ApiProperty({
    type: Number,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
    maxDecimalPlaces: 0,
  })
  @Min(0)
  @Type(() => Number)
  skip?: number;

  @ApiProperty({
    type: Number,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
    maxDecimalPlaces: 0,
  })
  @Min(0)
  @Type(() => Number)
  limit?: number;
}
export function withPagination<Clazz extends Constructor>(Base: Clazz) {
  return class extends HasPagination {};
}

export class HasTimeRange {
  @ApiProperty({
    type: Number,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
    maxDecimalPlaces: 0,
  })
  @Min(0)
  from: number;

  @ApiProperty({
    type: Number,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
    maxDecimalPlaces: 0,
  })
  @Min(0)
  to: number;
}
