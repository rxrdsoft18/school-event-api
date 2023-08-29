import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepositoryInterface } from '../interfaces';
import * as bcrypt from 'bcrypt';
import { Profile, User } from '../entities';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../dtos/create-user.dto';
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
    private readonly jwtService: JwtService,
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

  getTokenForUser(user: User) {
    return this.jwtService.sign({
      username: user.username,
      sub: user.id,
    });
  }

  getUserById(id: number) {
    return this.userRepository.findOneById(id);
  }

  async login(user: any) {
    return {
      userId: user.id,
      token: this.getTokenForUser(user),
    };
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async getExistingUserByUsernameOrEmail(username: string, email: string) {
    return this.userRepository.findByCondition({
      where: [{ username }, { email }],
    });
  }

  async register(createUserDto: CreateUserDto) {
    const { username, email, password, firstName, lastName, age } =
      createUserDto;

    const existingUser = await this.getExistingUserByUsernameOrEmail(
      username,
      email,
    );

    if (existingUser) {
      throw new BadRequestException(['username or email is already taken']);
    }

    const profile = new Profile();
    profile.age = age;

    const hashedPassword = await this.hashPassword(password);

    const createdUser = await this.userRepository.save({
      username,
      email,
      firstName,
      lastName,
      password: hashedPassword,
      profile,
    });

    return {
      user: {
        id: createdUser.id,
        username: createdUser.username,
        email: createdUser.email,
      },
      token: this.getTokenForUser(createdUser),
    };
  }
}
