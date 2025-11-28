import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { UnauthorizedException } from '@nestjs/common';

interface User {
  userId: number;
  email: string;
  name: string;
}

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<Request>();
    if (req.user) {
      const user = req.user as User;
      return data ? user[data as keyof User] : user;
    }
    throw new UnauthorizedException('User not found in request');
  },
);
