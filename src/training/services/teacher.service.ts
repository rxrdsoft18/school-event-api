import { Inject, Injectable } from '@nestjs/common';
import { TeacherRepositoryInterface } from '../interfaces/teacher.repository.interface';
import { CreateTeacher } from "../dtos/args/create-teacher.args";

@Injectable()
export class TeacherService {
  constructor(
    @Inject('TeacherRepositoryInterface')
    private readonly teacherRepository: TeacherRepositoryInterface,
  ) {}

  async getTeachers() {
    return this.teacherRepository.findAll();
  }

  async getTeacher(id: number) {
    return this.teacherRepository.findOneById(id);
  }

  async createTeacher(createTeacher: CreateTeacher) {
    return this.teacherRepository.save(createTeacher);
  }
}
