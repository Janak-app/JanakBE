import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { UserRole } from '../../common/enums/user-role.enum';
import { User } from '../users/entities/user.entity';
import { CartService } from '../cart/cart.service';
import { RedisService } from '../../common/services/redis.service';
import { JwtPayload } from './strategies/jwt.strategy';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private cartService: CartService,
    private redisService: RedisService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.usersRepository.findOne({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already in use');

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = this.usersRepository.create({
      email: dto.email,
      password: hashed,
      role: UserRole.CUSTOMER,
    });
    await this.usersRepository.save(user);
    const result = await this.login(user);
    if (dto.guestToken) await this.mergeGuestCartIfValid(dto.guestToken, user);
    return result;
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      where: { email },
      select: { id: true, email: true, password: true, role: true, isActive: true },
    });
    if (!user || !user.isActive) return null;
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;
    return user;
  }

  async login(user: User, guestToken?: string) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);

    if (guestToken) await this.mergeGuestCartIfValid(guestToken, user);

    return {
      accessToken, // used by controller to set cookie, not returned to client
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  private async mergeGuestCartIfValid(guestToken: string, user: User): Promise<void> {
    try {
      const payload = this.jwtService.verify<JwtPayload>(guestToken, {
        secret: this.configService.get<string>('jwt.secret'),
      });
      if (payload.role === UserRole.GUEST && payload.sub) {
        await this.cartService.mergeGuestCart(payload.sub, user);
      }
    } catch {
      // invalid or expired guest token — skip merge silently
    }
  }

  async logout(token: string, exp: number) {
    const ttl = exp - Math.floor(Date.now() / 1000);
    if (ttl > 0) await this.redisService.set(`blacklist:${token}`, '1', ttl);
    return { message: 'Logged out successfully' };
  }

  async guestLogin() {
    const guestId = randomUUID();
    const payload = { sub: guestId, email: 'guest', role: UserRole.GUEST };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '30d' });
    return { accessToken, guestId, user: { role: UserRole.GUEST } };
  }

  getMe(user: User) {
    if ((user as any).role === UserRole.GUEST) throw new UnauthorizedException('Guests do not have a profile');
    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }
}
