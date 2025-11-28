import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePortfolioDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
