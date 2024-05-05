import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsNumber, IsOptional, IsString, Min } from "class-validator";
import { HasPagination } from "src/utils/dto";

export type AddExpense = {
  user: number;
  category: string;
  amount: number;
  product?: string;
};

export class ExpenseQuery extends HasPagination {
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
  from?: number;

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
  to?: number;
}

export type GetExpense = {
  user: number;
  category?: string;
} & ExpenseQuery;

export class AddExpenseBody {
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  @Type(() => String)
  category: string;

  @ApiProperty({
    type: Number,
    minimum: 0,
    required: true,
  })
  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
  })
  @Min(0)
  @Type(() => Number)
  amount: number;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  @Type(() => String)
  product?: string;
}
