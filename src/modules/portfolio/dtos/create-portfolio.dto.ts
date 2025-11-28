import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { PortfolioType } from '../enums/portfolio-type.enum';

export class CreatePortfolioDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(PortfolioType, {
    message: 'type must be one of wallet, exchange, manual',
  })
  type: PortfolioType;
}
