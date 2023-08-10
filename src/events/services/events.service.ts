import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  AttendeesRepositoryInterface,
  EventsRepositoryInterface,
} from '../interfaces';
import { CreateEventDto } from '../dtos/create-event.dto';
import { UpdateEventDto } from '../dtos/update-event.dto';
import { Attendee, AttendeeAnswerEnum, PaginatedEvents } from '../entities';
import {
  ListEventOptions,
  WhenEventOptions,
} from '../find-options/list-event-options';
import { DeleteResult } from 'typeorm';
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

  findAll() {
    // return this.eventsRepository.findAll();
    return this.eventsRepository.getBaseQuery('e').getMany();
  }
  findAllWithAttendeeCountFiltered(options?: ListEventOptions) {
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
    const query = this.findAllWithAttendeeCountFiltered(options);
    return paginate(query, paginateOptions);
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

  create(createEventDto: CreateEventDto, user: User) {
    return this.eventsRepository.save({
      ...createEventDto,
      organizer: user,
    });
  }

  async update(id: number, updateEventDto: UpdateEventDto, user: User) {
    const event = await this.findOne(id);

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

  async delete(id: number, user: User) {
    const event = await this.findOne(id);

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
    const query = await this.getEventsOrganizedByUserId(userId);
    return paginate(query, paginatedOptions);
  }

  async getEventsOrganizedByUserId(userId: number) {
    return this.eventsRepository
      .getBaseQuery('e')
      .where('e.organizerId = :userId', { userId });
  }

  async getEventsAttendedByUserIdPaginated(
    userId: number,
    paginatedOptions: PaginateOptions,
  ): Promise<PaginatedEvents> {
    const query = await this.getEventsAttendedByUserId(userId);
    return paginate(query, paginatedOptions);
  }

  async getEventsAttendedByUserId(userId: number) {
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
    attende.name = 'Richard second';
    // attende.event = event;

    event.attendees.push(attende);

    // return await this.attendeesRepository.save(attende);
    await this.eventsRepository.save(event);
    return events;
  }
}
