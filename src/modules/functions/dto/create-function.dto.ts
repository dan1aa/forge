import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Length, Matches, Max, Min, ValidateNested } from 'class-validator';

export class LimitsDto {
  @ApiProperty({ example: 2000 })
  @IsInt() @Min(100) @Max(60_000)
  timeoutMs: number;

  @ApiProperty({ example: 64 })
  @IsInt() @Min(16) @Max(256)
  memoryMb: number;
}

export class CreateFunctionDto {
  @ApiProperty({ example: 'fib-calculator' })
  @IsString()
  @Matches(/^[a-z][a-z0-9-]{2,49}$/, {
    message: 'name must be 3-50 chars: lowercase letters, digits, dashes; start with a letter',
  })
  name: string;

  @ApiProperty({ example: 'return x * 2;' })
  @IsString() @Length(1, 10_000)
  code: string;

  @ApiPropertyOptional({ type: LimitsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => LimitsDto)
  limits?: LimitsDto;
}
