import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User], { name: 'users' })
  async getUsers(): Promise<User[]> {
    // For simplicity, assuming a method to get all users exists.
    // You might implement this in your Prisma service with `findMany()`.
    return this.usersService['prisma'].user.findMany();
  }

  @Query(() => User, { name: 'user', nullable: true })
  async getUser(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<User | null> {
    return this.usersService.findById(id);
  }

  @Mutation(() => User)
  async createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<User> {
    return this.usersService.create(createUserInput);
  }
}
