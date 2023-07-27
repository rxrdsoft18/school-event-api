import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  EventsRepositoryInterface,
  AttendeesRepositoryInterface,
} from './interfaces';
import { CreateEventDto } from './dtos/create-event.dto';
import { UpdateEventDto } from './dtos/update-event.dto';
import { Attendee, Event } from './entities';

@Injectable()
export class EventsService {
  constructor(
    @Inject('EventsRepositoryInterface')
    private readonly eventsRepository: EventsRepositoryInterface,
    @Inject('AttendeesRepositoryInterface')
    private readonly attendeesRepository: AttendeesRepositoryInterface,
  ) {}

  findAll() {
    return this.eventsRepository.findAll();
  }
  async findOne(id: number) {
    const event = await this.eventsRepository.findOneById(id);

    if (!event) {
      throw new NotFoundException();
    }

    return event;
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

  async practice() {
    // const event = new Event();
    // event.id = 1;

    const events = await this.eventsRepository.findAll({
      relations: ['attendees'],
    });

    const event = events[0];

    const attende = new Attendee();
    attende.name = 'Richard second';
    // attende.event = event;

    event.attendees.push(attende);

    // return await this.attendeesRepository.save(attende);
    await this.eventsRepository.save(event);
    return events;
  }
}
