import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserInput } from './dto/create-user.input';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async create(createUserInput: CreateUserInput): Promise<User> {
    if (!createUserInput.email) {
      throw new Error('Email is required');
    }

    let hashedPassword: string | undefined;
    if (createUserInput.password) {
      hashedPassword = await bcrypt.hash(createUserInput.password, 10);
    }

    return this.prisma.user.create({
      data: {
        email: createUserInput.email,
        password: hashedPassword,
        firstName: createUserInput.firstName,
        lastName: createUserInput.lastName,
      },
    });
  }
}
