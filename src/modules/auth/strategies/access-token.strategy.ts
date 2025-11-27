import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AppConfigService } from 'src/config/app.config.service';
import { UserService } from 'src/modules/user/user.service';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'access') {
  constructor(
    private readonly appConfigService: AppConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: appConfigService.accessTokenSecretKey,
    });
  }

  public async validate(payload: { sub: number }) {
    const user = await this.userService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('Invalid access token');
    }
    return user;
  }
}
