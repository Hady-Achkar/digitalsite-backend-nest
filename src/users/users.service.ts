import { Injectable } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private users: User[] = [];

  findByEmail(email: string): Promise<User | undefined> {
    return Promise.resolve(this.users.find((user) => user.email === email));
  }

  async create(userData: Partial<User>): Promise<User> {
    if (!userData.email) {
      throw new Error('Email is required');
    }

    let hashedPassword: string | undefined;
    if (userData.password && typeof userData.password === 'string') {
      // Now userData.password is explicitly a string
      if (typeof userData.password === 'string') {
        hashedPassword = await bcrypt.hash(userData.password, 10);
      }
    }

    const user: User = {
      id: this.users.length + 1,
      email: userData.email,
      password: hashedPassword,
      firstName: userData.firstName,
      lastName: userData.lastName,
    };

    this.users.push(user);
    return user;
  }
}
