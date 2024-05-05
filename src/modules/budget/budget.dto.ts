import { ApiProperty } from "@nestjs/swagger";
import { BudgetPeriod } from "@prisma/client";
import { Type } from "class-transformer";
import { IsEnum, IsNumber, IsOptional, IsString, Min } from "class-validator";

export type AddBudget = {
  user: number;
  category: string;
  amount: number;
  period?: BudgetPeriod;
};

export class AddBudgetBody {
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  @Type(() => Number)
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
    type: BudgetPeriod,
    enum: BudgetPeriod,
    required: false,
  })
  @IsOptional()
  @IsEnum(BudgetPeriod)
  @Type(() => String)
  period: BudgetPeriod;
}
