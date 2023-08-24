import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { BaseAbstractRepository } from '../../common/repositories/base/base-abstract.repository';
import { Teacher } from '../entities';
@Injectable()
export class TeacherRepository extends BaseAbstractRepository<Teacher> {
  constructor(
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
  ) {
    super(teacherRepository);
  }
}
