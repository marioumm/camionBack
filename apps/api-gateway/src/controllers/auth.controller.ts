/* eslint-disable @typescript-eslint/require-await */
import {
  Controller,
  Get,
  Post,
  Body,
  Inject,
  Req,
  Res,
  UseGuards,
  BadRequestException,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ClientProxy } from '@nestjs/microservices';
import { Response, Request } from 'express';
import { firstValueFrom } from 'rxjs';
import { OAuth2Client } from 'google-auth-library';
import { MobileGoogleAuthDto } from '../dto/mobile-google-auth.dto';

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

  @Post('mobile/google')
  @HttpCode(HttpStatus.OK)
  async mobileGoogleAuth(@Body() dto: MobileGoogleAuthDto) {
    const { idToken } = dto;

    if (!idToken) {
      throw new BadRequestException('ID token is required');
    }

    try {
      // Get allowed mobile client IDs from environment
      const allowedAudiences: string[] = [];
      const iosClientId = process.env.GOOGLE_IOS_CLIENT_ID;
      const androidClientId = process.env.GOOGLE_ANDROID_CLIENT_ID;
      
      if (iosClientId) allowedAudiences.push(iosClientId);
      if (androidClientId) allowedAudiences.push(androidClientId);

      if (allowedAudiences.length === 0) {
        throw new Error('No mobile client IDs configured');
      }

      // Verify ID token with Google
      const client = new OAuth2Client();
      const ticket = await client.verifyIdToken({
        idToken,
        audience: allowedAudiences,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new UnauthorizedException('Invalid token payload');
      }

      const googleId = payload.sub;
      const email = payload.email || '';
      const fullName = payload.name || '';

      if (!email || !googleId) {
        throw new UnauthorizedException('Email or Google ID not found in token');
      }

      // Call Users Service to create/link user and issue JWT
      const result = await firstValueFrom(
        this.usersClient.send(
          { cmd: 'oauth_login' },
          { email, fullName, googleId },
        ),
      );

      // Return JWT in response body (no cookies for mobile)
      return {
        accessToken: result.accessToken,
        user: result.user,
        isFirstLogin: result.isFirstLogin,
      };
    } catch (error: any) {
      const errorMessage = error?.message || JSON.stringify(error);
      
      // Log full error for debugging
      console.error('Mobile OAuth error details:', {
        message: errorMessage,
        statusCode: error?.statusCode,
        code: error?.code,
        fullError: error,
      });

      // Handle specific errors
      if (error?.statusCode === 409) {
        throw error; // Account conflict from Users Service
      }
      
      if (error?.message?.includes('No mobile client IDs')) {
        throw new UnauthorizedException('Mobile authentication not configured');
      }

      // Google library errors for token verification
      if (errorMessage.includes('Token used too late') || 
          errorMessage.includes('Token expired') ||
          errorMessage.includes('invalid_token') ||
          errorMessage.includes('audience') ||
          errorMessage.includes('Audience') ||
          errorMessage.includes('invalid audience')) {
        throw new UnauthorizedException('Invalid or expired ID token');
      }

      // Catch-all for verification errors
      if (errorMessage.includes('verifyIdToken') || 
          errorMessage.includes('verify') ||
          error?.code === 'ERR_INVALID_ARG_VALUE') {
        throw new UnauthorizedException(`Token verification failed: ${errorMessage}`);
      }

      // Default error
      throw new UnauthorizedException(`Authentication failed: ${errorMessage}`);
    }
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
