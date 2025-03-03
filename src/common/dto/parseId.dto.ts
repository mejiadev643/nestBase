import { Transform } from 'class-transformer';
import { IsInt, Min, IsString } from 'class-validator';


export class ParseIdDto {
      @Transform(({ value }) => parseInt(value))
      @IsInt()
      id: number;
}