import { Inject, Injectable } from '@nestjs/common';
import { TeacherRepositoryInterface } from '../interfaces/teacher.repository.interface';
import { CreateTeacher } from '../dtos/input/create-teacher.input';
import { Teacher } from '../entities';
import { UpdateTeacher } from '../dtos/input/update-teacher.input';
import { EntityWithId } from "../object-types/school.types";

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
    return this.teacherRepository.save(new Teacher(createTeacher));
  }

  async updateTeacher(id: number, updateTeacher: UpdateTeacher) {
    const teacher = await this.teacherRepository.findOneById(id);
    return this.teacherRepository.save(
      new Teacher(Object.assign(teacher, updateTeacher)),
    );
  }

  async deleteTeacher(id: number) {
    const teacher = await this.teacherRepository.findOneById(id);
    await this.teacherRepository.remove(teacher);
    return new EntityWithId(id);
  }
}
