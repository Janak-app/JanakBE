import { Body, Controller, Get, Post, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { User } from '../users/entities/user.entity';
import { JwtPayload } from './strategies/jwt.strategy';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AuthCookieInterceptor, ClearAuthCookie } from './interceptors/auth-cookie.interceptor';

@ApiTags('Auth')
@Controller('auth')
@UseInterceptors(AuthCookieInterceptor)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register with email and password' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  login(@Request() req: { user: User }, @Body() dto: LoginDto) {
    return this.authService.login(req.user, dto.guestToken);
  }

  @Public()
  @Post('guest')
  @ApiOperation({ summary: 'Continue as guest' })
  guestLogin() {
    return this.authService.guestLogin();
  }

  @Post('logout')
  @ClearAuthCookie()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout current user' })
  logout(
    @Request() req: { user: JwtPayload; cookies: { accessToken?: string }; headers: { authorization?: string } },
  ) {
    const token = req.cookies?.accessToken ?? req.headers.authorization?.split(' ')[1] ?? '';
    return this.authService.logout(token);
  }

  @Public()
  @Post('forgot-password')
  @ApiOperation({ summary: 'Send password reset email' })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    await this.authService.forgotPassword(dto.email);
    return { message: 'If this email exists, a reset link has been sent' };
  }

  @Public()
  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password using token from email' })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.authService.resetPassword(dto.token, dto.password);
    return { message: 'Password reset successfully' };
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user' })
  getMe(@CurrentUser() user: User) {
    return this.authService.getMe(user);
  }
}
