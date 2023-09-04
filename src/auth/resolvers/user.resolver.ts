import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from '../decorators/current-user.decorator';
import { User } from '../entities';
import { JwtAuthGqlGuard } from '../guards/jwt-auth-gql.guard';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserService } from '../services/user.service';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User, { nullable: true })
  @UseGuards(JwtAuthGqlGuard)
  async me(@CurrentUser() user: User): Promise<User> {
    return user;
  }

  @Mutation(() => User)
  async register(@Args('createUser') createUser: CreateUserDto) {
    return this.userService.create(createUser);
  }
}
