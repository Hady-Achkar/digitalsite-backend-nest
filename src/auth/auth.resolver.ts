import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { Request } from 'express';
import { User } from 'src/users/entities/user.entity';
import { LoginResponse } from './dto/login.response';

interface GqlContext {
  req: Request & { user?: User };
}

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => LoginResponse)
  async login(
    @Args('loginInput') loginInput: LoginInput,
  ): Promise<LoginResponse> {
    const safeUser = await this.authService.validateUser(
      loginInput.email,
      loginInput.password,
    );
    return this.authService.login(safeUser);
  }

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  me(@Context() context: GqlContext): User {
    return context.req.user as User;
  }
}
