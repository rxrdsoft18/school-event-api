import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  AttendeesRepositoryInterface,
  EventsRepositoryInterface,
} from './interfaces';
import { CreateEventDto } from './dtos/create-event.dto';
import { UpdateEventDto } from './dtos/update-event.dto';
import { Attendee, AttendeeAnswerEnum } from './entities';
import {
  ListEventOptions,
  WhenEventOptions,
} from './find-options/list-event-options';

@Injectable()
export class EventsService {
  constructor(
    @Inject('EventsRepositoryInterface')
    private readonly eventsRepository: EventsRepositoryInterface,
    @Inject('AttendeesRepositoryInterface')
    private readonly attendeesRepository: AttendeesRepositoryInterface,
  ) {}

  private getEventsWithAttendeeCountQuery() {
    return this.eventsRepository
      .getBaseQuery('e')
      .loadRelationCountAndMap('e.attendeeCount', 'e.attendees')
      .loadRelationCountAndMap(
        'e.attendeeAccepted',
        'e.attendees',
        'attendee',
        (qb) =>
          qb.where('attendee.answer = :answer', {
            answer: AttendeeAnswerEnum.Accepted,
          }),
      )
      .loadRelationCountAndMap(
        'e.attendeeRejected',
        'e.attendees',
        'attendee',
        (qb) =>
          qb.where('attendee.answer = :answer', {
            answer: AttendeeAnswerEnum.Rejected,
          }),
      )
      .loadRelationCountAndMap(
        'e.attendeeMaybe',
        'e.attendees',
        'attendee',
        (qb) =>
          qb.where('attendee.answer = :answer', {
            answer: AttendeeAnswerEnum.Maybe,
          }),
      );
  }

  findAll(options?: ListEventOptions) {
    // return this.eventsRepository.findAll();
    // return this.eventsRepository.getBaseQuery('e').getMany();

    let query = this.getEventsWithAttendeeCountQuery();

    if (!options) return query.getMany();

    if (options.when) {
      if (options.when === WhenEventOptions.Today) {
        query = query.andWhere(
          `e.when >= CURDATE() AND e.when <= CURDATE() + INTERVAL 1 DAY`,
        );
      }
      if (options.when === WhenEventOptions.Tommorrow) {
        query = query.andWhere(
          `e.when >= CURDATE() + INTERVAL 1 DAY AND e.when <= CURDATE() + INTERVAL 2 DAY`,
        );
      }
      if (options.when === WhenEventOptions.ThisWeek) {
        query = query.andWhere(`YEARWEEK(e.when, 1) = YEARWEEK(CURDATE(), 1)`);
      }
      if (options.when === WhenEventOptions.NextWeek) {
        query = query.andWhere(
          `YEARWEEK(e.when, 1) = YEARWEEK(CURDATE(), 1) + 1`,
        );
      }
    }

    return query.getMany();
  }
  async findOne(id: number) {
    // const event = await this.eventsRepository.findOneById(id);
    const event = await this.getEventsWithAttendeeCountQuery()
      .andWhere('e.id = :id', { id })
      .getOne();

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
