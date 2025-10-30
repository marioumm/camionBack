/* eslint-disable @typescript-eslint/require-await */
import { Controller, Get, Inject, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ClientProxy } from '@nestjs/microservices';
import { Response, Request } from 'express';
import { firstValueFrom } from 'rxjs';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('USERS_SERVICE') private readonly usersClient: ClientProxy,
  ) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    return;
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    const profile = req.user as {
      email: string;
      fullName: string;
      googleId: string;
    };

    const { email, fullName, googleId } = profile;

    const result = await firstValueFrom(
      this.usersClient.send(
        { cmd: 'oauth_login' },
        { email, fullName, googleId },
      ),
    );

    const accessToken: string = result?.accessToken;

    const cookieDomain = process.env.COOKIE_DOMAIN || undefined;
    const maxAgeMs = 7 * 24 * 60 * 60 * 1000; // 7 days
    const sameSite =
      (process.env.COOKIE_SAMESITE as 'lax' | 'strict' | 'none') || 'none';
    const secure = process.env.COOKIE_SECURE === 'true' || sameSite === 'none';

    res.cookie('token', accessToken, {
      httpOnly: false,
      secure,
      sameSite,
      domain: cookieDomain,
      maxAge: maxAgeMs,
      path: '/',
    });

    const redirectUrl = process.env.FRONTEND_REDIRECT_URL || '/';
    return res.redirect(302, redirectUrl);
  }

  @Get('logout')
  async logout(@Res() res: Response) {
    const cookieDomain = process.env.COOKIE_DOMAIN || undefined;
    const sameSite =
      (process.env.COOKIE_SAMESITE as 'lax' | 'strict' | 'none') || 'none';
    const secure = process.env.COOKIE_SECURE === 'true' || sameSite === 'none';

    res.clearCookie('token', {
      httpOnly: false,
      secure,
      sameSite,
      domain: cookieDomain,
      path: '/',
    });

    const redirectUrl = process.env.FRONTEND_ORIGIN || '/';
    return res.redirect(302, redirectUrl);
  }
}
