import { Inject, Injectable } from '@nestjs/common';
import { CreateTrainingDto } from './dtos';
import { Subject, Teacher } from './entities';
import { SubjectRepositoryInterface } from './interfaces';

@Injectable()
export class TrainingService {
  constructor(
    @Inject('SubjectRepositoryInterface')
    private readonly subjectRepository: SubjectRepositoryInterface,
  ) {}
  async savingRelation(createTraining: CreateTrainingDto) {
    const subject = new Subject();
    subject.name = createTraining.subjectName;
    subject.teachers = [];

    for (const teacher of createTraining.teacherNames) {
      const newTeacher = new Teacher();
      newTeacher.name = teacher;

      subject.teachers.push(newTeacher);
    }

    await this.subjectRepository.save(subject);
  }

  async removeRelation() {
    const subject = await this.subjectRepository.findByCondition({
      where: { id: 1 },
      relations: ['teachers'],
    });
    subject.teachers = subject.teachers.filter((teacher) => teacher.id !== 3);
    await this.subjectRepository.save(subject);
  }
}
