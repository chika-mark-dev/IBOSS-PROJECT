import { Transform, TransformFnParams } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

const trimText = ({ value }: TransformFnParams) =>
  typeof value === 'string' ? value.trim() : value;

const trimEach = ({ value }: TransformFnParams) =>
  Array.isArray(value)
    ? value.map((v) => (typeof v === 'string' ? v.trim() : v))
    : value;

export class CreateQuestionDto {
  @Transform(trimText)
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  text!: string;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(6)
  @Transform(trimEach)
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @MaxLength(300, { each: true })
  options!: string[];

  @IsInt()
  @Min(0)
  correctIndex!: number;
}
