import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @Length(2, 120)
  @Transform(({ value }) => value?.trim())
  name!: string;

  @IsEmail({}, { message: 'email must be a valid email address' })
  @MaxLength(255)
  @Transform(({ value }) => value?.trim().toLowerCase())
  email!: string;

  @IsOptional()
  @IsString()
  @Length(1, 64)
  @Transform(({ value }) => value?.trim())
  student_school_id?: string;

  @IsString()
  @MinLength(8, { message: 'password must be at least 8 characters' })
  @MaxLength(72, { message: 'password must be at most 72 characters' })
  @Matches(/(?=.*[a-z])/, {
    message: 'password must contain a lowercase letter',
  })
  @Matches(/(?=.*[A-Z])/, {
    message: 'password must contain an uppercase letter',
  })
  @Matches(/(?=.*\d)/, { message: 'password must contain a number' })
  password!: string;
}
