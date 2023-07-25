import { Inject, Injectable } from '@nestjs/common';
import { EventsRepositoryInterface } from './interfaces/events.repository.interface';
import { CreateEventDto } from './dtos/create-event.dto';
import { UpdateEventDto } from './dtos/update-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @Inject('EventsRepositoryInterface')
    private readonly eventsRepository: EventsRepositoryInterface,
  ) {}

  findAll() {
    return this.eventsRepository.findAll();
  }
  findOne(id: number) {
    return this.eventsRepository.findOneById(id);
  }

  create(createEventDto: CreateEventDto) {
    return this.eventsRepository.save(createEventDto);
  }

  async update(id: number, updateEventDto: UpdateEventDto) {
    const event = await this.findOne(id);

    const updateEvent = {
      ...event,
      ...updateEventDto,
      when: updateEventDto.when ? new Date(updateEventDto.when) : event.when,
    };

    return this.eventsRepository.save(updateEvent);
  }

  async delete(id: number) {
    const event = await this.findOne(id);
    await this.eventsRepository.remove(event);
  }
}
