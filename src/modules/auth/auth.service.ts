import { ConflictException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AppConfigService } from '../../config/config.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: AppConfigService,
  ) {}

  public async register(
    registerDto: RegisterDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const user = await this.userService.createUser({
        name: registerDto.name,
        email: registerDto.email,
        password: registerDto.password,
      });

      const accessToken = await this.generateAccessToken(user.id);
      const refreshToken = await this.generateRefreshToken(user.id);

      return { accessToken, refreshToken };
    } catch (error) {
      if (error instanceof Error) {
        throw new ConflictException(`Registration failed: ${error.message}`);
      }
      throw error;
    }
  }

  public async generateAccessToken(userId: number): Promise<string> {
    const payload = { sub: userId };

    return this.jwtService.signAsync(payload, {
      secret: this.configService.accessTokenSecretKey,
      expiresIn: this.configService.accessTokenExpirationTime,
    });
  }

  public async generateRefreshToken(userId: number): Promise<string> {
    const payload = { sub: userId };
    return this.jwtService.signAsync(payload, {
      secret: this.configService.refreshTokenSecretKey,
      expiresIn: this.configService.refreshTokenExpirationTime,
    });
  }
}
