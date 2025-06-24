import { IsOptional, IsInt, Min, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class PaginationDto {
  @IsOptional()
  @Transform(({ value }) => {
    const parsedValue = parseInt(value, 10);
    return parsedValue === 0 ? 0 : parsedValue - 1;
  })
  @IsInt()
  @Min(0)
  skip?: number = 0;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  take?: number = 5;

  @IsOptional()
  @IsString()
  search?: string = '';

  @IsOptional()
  @IsString()
  orderBy?: string = 'id';

  @IsOptional()
  @IsString()
  order?: 'asc' | 'desc' = 'desc';
}
