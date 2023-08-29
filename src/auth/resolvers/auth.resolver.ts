import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from '../services/auth.service';
import { Login } from '../dtos/input/login.input';
import { TokenOutput } from '../dtos/output/token.output';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => TokenOutput)
  async login(
    @Args('login', { type: () => Login }) login: Login,
  ): Promise<TokenOutput> {
    return new TokenOutput({
      token: this.authService.getTokenForUser(
        await this.authService.validateUser(login.email, login.password),
      ),
    });
  }
}
