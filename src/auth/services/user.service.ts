import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UserRepositoryInterface } from '../interfaces';
import { CreateUserDto } from '../dtos/create-user.dto';
import { Profile } from '../entities';
import { AuthService } from './auth.service';

@Injectable()
export class UserService {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
    private readonly authService: AuthService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { username, email, password, firstName, lastName, age } =
      createUserDto;

    const existingUser =
      await this.authService.getExistingUserByUsernameOrEmail(username, email);

    if (existingUser) {
      throw new BadRequestException(['username or email is already taken']);
    }

    const profile = new Profile();
    profile.age = age;

    const hashedPassword = await this.authService.hashPassword(password);

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
      token: this.authService.getTokenForUser(createdUser),
    };
  }
}
