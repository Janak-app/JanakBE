import { Body, Controller, Get, Post, Request, Response, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Response as Res } from 'express';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { User } from '../users/entities/user.entity';
import { JwtPayload } from './strategies/jwt.strategy';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: 'none' as const,
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in ms
};

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register with email and password' })
  async register(@Body() dto: RegisterDto, @Response({ passthrough: true }) res: Res) {
    const { accessToken, ...result } = await this.authService.register(dto);
    res.cookie('accessToken', accessToken, COOKIE_OPTIONS);
    return result;
  }

  @Public()
  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  async login(
    @Request() req: { user: User },
    @Body() dto: LoginDto,
    @Response({ passthrough: true }) res: Res,
  ) {
    const { accessToken, ...result } = await this.authService.login(req.user, dto.guestToken);
    res.cookie('accessToken', accessToken, COOKIE_OPTIONS);
    return result;
  }

  @Public()
  @Post('guest')
  @ApiOperation({ summary: 'Continue as guest' })
  async guestLogin(@Response({ passthrough: true }) res: Res) {
    const { accessToken, ...result } = await this.authService.guestLogin();
    res.cookie('accessToken', accessToken, COOKIE_OPTIONS);
    return result;
  }

  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout current user' })
  async logout(
    @Request() req: { user: JwtPayload; cookies: { accessToken?: string }; headers: { authorization?: string } },
    @Response({ passthrough: true }) res: Res,
  ) {
    const token = req.cookies?.accessToken ?? req.headers.authorization?.split(' ')[1] ?? '';
    res.clearCookie('accessToken', COOKIE_OPTIONS);
    return this.authService.logout(token, req.user.exp ?? 0);
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user' })
  getMe(@CurrentUser() user: User) {
    return this.authService.getMe(user);
  }
}
