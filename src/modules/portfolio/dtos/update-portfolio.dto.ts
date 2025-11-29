import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePortfolioDto {
  @ApiProperty({
    description: 'Name of the portfolio',
    example: 'My Updated Crypto Portfolio',
  })
  @IsNotEmpty()
  @IsString()
  name: string;
}
