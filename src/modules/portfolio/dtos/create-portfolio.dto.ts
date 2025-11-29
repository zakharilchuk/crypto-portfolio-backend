import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { PortfolioType } from '../enums/portfolio-type.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePortfolioDto {
  @ApiProperty({
    description: 'Name of the portfolio',
    example: 'My Crypto Portfolio',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Type of the portfolio',
    example: 'manual',
    enum: PortfolioType,
  })
  @IsNotEmpty()
  @IsString()
  @IsEnum(PortfolioType, {
    message: 'type must be one of wallet, exchange, manual',
  })
  type: PortfolioType;
}
