import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { Gender } from '../../users/entities/user.entity';

export class RegisterDto {
  @IsString() @IsNotEmpty()
  displayName: string;

  @IsEmail()
  email: string;

  @IsString() @MinLength(8)
  password: string;

  @IsEnum(Gender)
  gender: Gender;

  @IsString() @IsNotEmpty()
  city: string;

  @IsOptional() @IsString()
  phone?: string;
}
