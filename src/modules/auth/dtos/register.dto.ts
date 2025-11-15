import { IsEmail, IsNotEmpty, MinLength, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class RegisterDto {
  @IsNotEmpty({ message: 'Name is required.' })
  @Length(1, 100, { message: 'Name must be between 1 and 100 characters.' })
  name: string;

  @IsEmail({}, { message: 'Email must be a valid email address.' })
  @Transform(({ value }: { value: string }) => value.toLowerCase())
  email: string;

  @IsNotEmpty({ message: 'Password is required.' })
  @MinLength(6, { message: 'Password must be at least 6 characters long.' })
  password: string;
}
