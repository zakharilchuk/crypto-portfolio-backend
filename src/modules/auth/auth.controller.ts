import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import type { Response, Request } from 'express';
import { LoginDto } from './dtos/login.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  public async register(
    @Body() registerDto: RegisterDto,
    @Res() res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.register(registerDto);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({ accessToken: accessToken });
  }

  @Post('login')
  public async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const { accessToken, refreshToken } =
      await this.authService.login(loginDto);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ accessToken });
  }

  @UseGuards(AuthGuard('refresh'))
  @Post('refresh')
  public async refresh(@Req() req: Request, @Res() res: Response) {
    const request = req as Request & {
      cookies?: { refreshToken?: string };
    };
    const refreshToken = request.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token missing' });
    }
    const { accessToken, newRefreshToken } =
      await this.authService.refreshTokens(refreshToken);

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ accessToken });
  }

  @Post('logout')
  public logOut(@Res() res: Response) {
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out successfully' });
  }
}
