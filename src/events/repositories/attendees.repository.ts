import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { BaseAbstractRepository } from '../../common/repositories/base/base-abstract.repository';
import { Attendee } from '../entities';
@Injectable()
export class AttendeesRepository extends BaseAbstractRepository<Attendee> {
  constructor(
    @InjectRepository(Attendee)
    private readonly attendeesRepository: Repository<Attendee>,
  ) {
    super(attendeesRepository);
  }
}
