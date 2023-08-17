import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventsRepositoryInterface } from '../interfaces';
import { CreateEventDto } from '../dtos/create-event.dto';
import { UpdateEventDto } from '../dtos/update-event.dto';
import {
  Attendee,
  AttendeeAnswerEnum,
  Event,
  PaginatedEvents,
} from '../entities';
import {
  ListEventOptions,
  WhenEventOptions,
} from '../find-options/list-event-options';
import { DeleteResult, SelectQueryBuilder } from 'typeorm';
import { User } from '../../auth/entities';
import {
  paginate,
  PaginateOptions,
} from '../../common/utils/pagination/paginator';

@Injectable()
export class EventsService {
  constructor(
    @Inject('EventsRepositoryInterface')
    private readonly eventsRepository: EventsRepositoryInterface,
  ) {}

  private getEventsWithAttendeeCountQuery(): SelectQueryBuilder<Event> {
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

  findAll(): Promise<Event[]> {
    // return this.eventsRepository.findAll();
    return this.eventsRepository.getBaseQuery('e').getMany();
  }
  getEventsWithAttendeeCountFilteredQuery(
    options?: ListEventOptions,
  ): SelectQueryBuilder<Event> {
    let query = this.getEventsWithAttendeeCountQuery();

    // if (!options) return query.getMany();
    if (!options) return query;

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

    // return query.getMany();
    return query;
  }

  async findAllWithAttendeeCountFilteredPaginated(
    options: ListEventOptions,
    paginateOptions: PaginateOptions,
  ): Promise<PaginatedEvents> {
    const query = this.getEventsWithAttendeeCountFilteredQuery(options);
    return paginate(query, paginateOptions);
  }

  async getEventWithAttendeeCount(id: number): Promise<Event> {
    // const event = await this.eventsRepository.findOneById(id);
    const event = await this.getEventsWithAttendeeCountQuery()
      .andWhere('e.id = :id', { id })
      .getOne();

    if (!event) {
      throw new NotFoundException();
    }

    return event;
  }

  async findOne(id: number): Promise<Event> {
    return this.eventsRepository.findOneById(id);
  }

  async create(createEventDto: CreateEventDto, user: User): Promise<Event> {
    return await this.eventsRepository.save(
      new Event({
        ...createEventDto,
        organizer: user,
        when: new Date(createEventDto.when),
      }),
    );
  }

  async update(
    id: number,
    updateEventDto: UpdateEventDto,
    user: User,
  ): Promise<Event> {
    const event = await this.findOne(id);

    if (!event) {
      throw new NotFoundException();
    }

    if (event.organizerId !== user.id) {
      throw new ForbiddenException(
        null,
        'You are not authorized to change this event',
      );
    }

    const updateEvent = {
      ...event,
      ...updateEventDto,
      when: updateEventDto.when ? new Date(updateEventDto.when) : event.when,
    };

    return this.eventsRepository.save(updateEvent);
  }

  async delete(id: number, user: User): Promise<void> {
    const event = await this.findOne(id);

    if (!event) {
      throw new NotFoundException();
    }

    if (event.organizerId !== user.id) {
      throw new ForbiddenException(
        null,
        'You are not authorized to change this event',
      );
    }
    await this.eventsRepository.remove(event);
  }

  async deleteEvent(id: number, user: User): Promise<DeleteResult> {
    const event = await this.findOne(id);

    if (!event) {
      throw new NotFoundException();
    }

    if (event.organizerId !== user.id) {
      throw new ForbiddenException(
        null,
        'You are not authorized to change this event',
      );
    }

    return this.eventsRepository
      .getBaseQuery('e')
      .delete()
      .where('id = :id', { id })
      .execute();
  }

  async getEventsOrganizedByUserIdPaginated(
    userId: number,
    paginatedOptions: PaginateOptions,
  ): Promise<PaginatedEvents> {
    const query = this.getEventsOrganizedByUserIdQuery(userId);
    return paginate(query, paginatedOptions);
  }

  getEventsOrganizedByUserIdQuery(userId: number): SelectQueryBuilder<Event> {
    return this.eventsRepository
      .getBaseQuery('e')
      .where('e.organizerId = :userId', { userId });
  }

  async getEventsAttendedByUserIdPaginated(
    userId: number,
    paginatedOptions: PaginateOptions,
  ): Promise<PaginatedEvents> {
    const query = this.getEventsAttendedByUserIdQuery(userId);
    return paginate(query, paginatedOptions);
  }

  getEventsAttendedByUserIdQuery(userId: number): SelectQueryBuilder<Event> {
    return this.eventsRepository
      .getBaseQuery('e')
      .leftJoinAndSelect('e.attendees', 'a')
      .where('a.userId = :userId', { userId });
  }

  async practice() {
    // const event = new Event();
    // event.id = 1;

    const events = await this.eventsRepository.findAll({
      relations: ['attendees'],
    });

    const event = events[0];

    const attende = new Attendee();
    // attende.name = 'Richard second';
    // attende.event = event;

    event.attendees.push(attende);

    // return await this.attendeesRepository.save(attende);
    await this.eventsRepository.save(event);
    return events;
  }
}
