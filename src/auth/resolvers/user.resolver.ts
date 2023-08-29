import { Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from '../decorators/current-user.decorator';
import { User } from '../entities';
import { JwtAuthGqlGuard } from '../guards/jwt-auth-gql.guard';

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  @UseGuards(JwtAuthGqlGuard)
  async me(@CurrentUser() user: User): Promise<User> {
    return user;
  }
}
