import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Event } from '../entities';
import { BaseAbstractRepository } from '../../common/repositories/base/base-abstract.repository';

@Injectable()
export class EventsRepository extends BaseAbstractRepository<Event> {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {
    super(eventRepository);
  }
}
