import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrainingController } from './training.controller';
import { TrainingService } from './training.service';
import { Subject, Teacher } from './entities';
import { SubjectRepository } from './repositories';

@Module({
  imports: [TypeOrmModule.forFeature([Teacher, Subject])],
  controllers: [TrainingController],
  providers: [
    TrainingService,
    {
      provide: 'SubjectRepositoryInterface',
      useClass: SubjectRepository,
    },
  ],
})
export class TrainingModule {}
