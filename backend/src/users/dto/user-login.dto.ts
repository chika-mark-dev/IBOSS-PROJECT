import { Transform } from 'class-transformer';
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @Transform(({ value }) => value?.trim().toLowerCase())
  email!: string;

  @IsOptional()
  @IsString()
  student_school_id!: string;

  @IsString()
  @MinLength(1)
  password!: string;
}
