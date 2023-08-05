import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import ormConfig from './config/orm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsModule } from './events/events.module';
import { TrainingModule } from './training/training.module';
import { AuthModule } from './auth/auth.module';
import ormConfigProd from './config/orm.config.prod';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ormConfig],
      expandVariables: true,
      envFilePath: [`${process.env.NODE_ENV ?? ''}.env`],
    }),
    TypeOrmModule.forRootAsync({
      useFactory:
        process.env.NODE_ENV !== 'production' ? ormConfig : ormConfigProd,
    }),
    EventsModule,
    TrainingModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
