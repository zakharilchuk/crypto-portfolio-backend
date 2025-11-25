import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AppConfigService } from '../../config/app.config.service';
import { LoginDto } from './dtos/login.dto';

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

  public async login(
    loginDto: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userService.findByEmail(loginDto.email);

    const isPasswordValid =
      user &&
      (await this.userService.isPasswordValid(
        loginDto.password,
        user.password,
      ));

    if (!user || !isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const accessToken = await this.generateAccessToken(user.id);
    const refreshToken = await this.generateRefreshToken(user.id);

    return { accessToken, refreshToken };
  }

  public async refreshTokens(
    refreshToken: string,
  ): Promise<{ accessToken: string; newRefreshToken: string }> {
    try {
      const payload: { sub: number } = await this.jwtService.verifyAsync(
        refreshToken,
        {
          secret: this.configService.refreshTokenSecretKey,
        },
      );

      const userId = payload.sub;
      const accessToken = await this.generateAccessToken(userId);
      const newRefreshToken = await this.generateRefreshToken(userId);

      return { accessToken, newRefreshToken };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
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
