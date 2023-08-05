import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepositoryInterface } from './interfaces';
import * as bcrypt from 'bcrypt';
import { User } from "./entities";
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findByCondition({
      where: { email },
    });

    if (!user) {
      this.logger.debug(`User with email: ${email} not found`);
      throw new UnauthorizedException();
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      this.logger.debug(`Invalid credentials`);
      throw new UnauthorizedException();
    }

    return user;
  }
}
