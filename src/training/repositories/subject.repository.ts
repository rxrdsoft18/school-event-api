import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { BaseAbstractRepository } from '../../common/repositories/base/base-abstract.repository';
import { Subject } from '../entities';
@Injectable()
export class SubjectRepository extends BaseAbstractRepository<Subject> {
  constructor(
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
  ) {
    super(subjectRepository);
  }
}
