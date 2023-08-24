import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrainingController } from './training.controller';
import { TrainingService } from './training.service';
import { Subject, Teacher } from './entities';
import { SubjectRepository, TeacherRepository } from "./repositories";
import { TeacherResolver } from './resolvers/teacher.resolver';
import { TeacherService } from "./services/teacher.service";

@Module({
  imports: [TypeOrmModule.forFeature([Teacher, Subject])],
  // controllers: [TrainingController],
  providers: [
    TrainingService,
    {
      provide: 'SubjectRepositoryInterface',
      useClass: SubjectRepository,
    },
    {
      provide: 'TeacherRepositoryInterface',
      useClass: TeacherRepository,
    },
    TeacherResolver,
    TeacherService,
  ],
})
export class TrainingModule {}
