import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entities/user.entity';

type SafeUser = Omit<User, 'password'>;

function omitPassword(user: User): SafeUser {
  const { password: _password, ...rest } = user;
  return rest;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<SafeUser> {
    const user = await this.usersService.findByEmail(email);
    if (user && user.password && (await bcrypt.compare(pass, user.password))) {
      return omitPassword(user);
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  login(user: SafeUser) {
    const payload = { email: user.email, sub: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }

  async validateGoogleUser(profile: any): Promise<User> {
    interface GoogleProfile {
      emails: { value: string }[];
      name: { givenName: string; familyName: string };
    }
    const googleProfile = profile as GoogleProfile;
    let user = await this.usersService.findByEmail(
      googleProfile.emails[0].value,
    );
    if (!user) {
      user = await this.usersService.create({
        email: googleProfile.emails[0].value,
        password: undefined,
        firstName: googleProfile.name.givenName,
        lastName: googleProfile.name.familyName,
      });
    }
    return user;
  }
}
