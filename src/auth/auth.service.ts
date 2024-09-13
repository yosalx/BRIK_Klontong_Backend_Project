import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(username: string, password: string) {
    try {
      await this.usersService.findOne(username);
      throw new BadRequestException('Username already exists');
    } catch (error) {
      if (error instanceof NotFoundException) {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = await this.usersService.create(
          username,
          hashedPassword,
        );

        const payload = { username: newUser.username, sub: newUser.id };
        return {
          access_token: this.jwtService.sign(payload),
        };
      }

      throw error;
    }
  }

  async validateUser(username: string, pass: string): Promise<any> {
    try {
      const user = await this.usersService.findOne(username);
      if (user) {
        const isPasswordValid = await bcrypt.compare(pass, user.password);
        if (isPasswordValid) {
          const { password, ...result } = user;
          return result;
        }
      }
      return null;
    } catch (error) {
      console.error('Error validating user:', error);
      return null;
    }
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
