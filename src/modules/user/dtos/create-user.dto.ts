import { IsEmail, IsNotEmpty, Length, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Name is required.' })
  @Length(1, 100, { message: 'Name must be between 1 and 100 characters.' })
  readonly name: string;

  @IsEmail({}, { message: 'Email must be a valid email address.' })
  readonly email: string;

  @IsNotEmpty({ message: 'Password is required.' })
  @MinLength(6, { message: 'Password must be at least 6 characters long.' })
  readonly password: string;
}
