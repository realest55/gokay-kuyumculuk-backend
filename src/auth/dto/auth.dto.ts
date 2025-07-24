import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional } from 'class-validator';

export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  @IsOptional() // İsim alanı kayıt olurken opsiyonel olabilir.
  name?: string;
}