import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './repositories';
import { LocalStrategy } from './strategies/local.strategy';
import { User } from './entities';
import { AuthService } from './auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    {
      provide: 'UserRepositoryInterface',
      useClass: UserRepository,
    },
    LocalStrategy,
    AuthService,
  ],
})
export class AuthModule {}
