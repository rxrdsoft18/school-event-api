import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './services/events.service';
import { Event } from './entities';
import { UpdateEventDto } from './dtos/update-event.dto';
import { User } from '../auth/entities';
import { EventsRepositoryInterface } from './interfaces';
import { createMock } from '@golevelup/ts-jest';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { PaginateOptions } from '../common/utils/pagination/paginator';
import * as paginator from './../common/utils/pagination/paginator';

jest.mock('../common/utils/pagination/paginator');

describe('EventsService', () => {
  let eventsService: EventsService;
  const eventRepositoryMock = createMock<EventsRepositoryInterface>();
  let paginateMock;

  beforeEach(async () => {
    paginateMock = paginator.paginate as jest.Mock;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: 'EventsRepositoryInterface',
          useValue: eventRepositoryMock,
        },
      ],
    }).compile();

    eventsService = module.get<EventsService>(EventsService);
  });

  describe('updateEvent', () => {
    it('should update the event', async () => {
      const eventId = 1;
      const updateEventDto: UpdateEventDto = {
        address: 'New address',
      };

      const user = {
        id: 2,
      } as User;

      jest.spyOn(eventsService, 'findOne').mockResolvedValue({
        id: eventId,
        organizerId: 2,
        when: new Date('2023-08-16 23:16'),
      } as Event);

      eventRepositoryMock.save.mockResolvedValue({
        id: 1,
        address: 'New address',
      } as Event);

      const updatedEvent = await eventsService.update(
        eventId,
        updateEventDto,
        user,
      );
      expect(updatedEvent).toEqual({
        id: eventId,
        address: 'New address',
      });
      expect(eventRepositoryMock.save).toBeCalledWith({
        id: 1,
        address: 'New address',
        organizerId: 2,
        when: new Date('2023-08-16 23:16'),
      });
    });
    it('should return exception: NotFoundException', async () => {
      const eventId = 1;
      const updateEventDto: UpdateEventDto = {
        address: 'New address',
      };

      const user = {
        id: 2,
      } as User;

      jest.spyOn(eventsService, 'findOne').mockResolvedValue(null);

      await expect(
        eventsService.update(eventId, updateEventDto, user),
      ).rejects.toThrow(new NotFoundException());
    });
    it('should return exception: ForbiddenException', async () => {
      const eventId = 1;
      const updateEventDto: UpdateEventDto = {
        address: 'New address',
      };

      const user = {
        id: 3,
      } as User;

      jest
        .spyOn(eventsService, 'findOne')
        .mockResolvedValue({ id: eventId, organizerId: 2 } as Event);

      await expect(
        eventsService.update(eventId, updateEventDto, user),
      ).rejects.toThrow(
        new ForbiddenException(
          null,
          'You are not authorized to change this event',
        ),
      );
    });
  });

  describe('deleteEvent', () => {
    it('should delete the event', async () => {
      const eventId = 1;
      jest.spyOn(eventsService, 'findOne').mockResolvedValue({
        id: eventId,
        organizerId: 2,
      } as Event);

      const user = {
        id: 2,
      } as User;

      await eventsService.deleteEvent(eventId, user);

      expect(eventRepositoryMock.getBaseQuery).toHaveBeenCalledTimes(1);
      expect(eventRepositoryMock.getBaseQuery).toHaveBeenCalledWith('e');

      expect(
        eventRepositoryMock.getBaseQuery('e').delete,
      ).toHaveBeenCalledTimes(1);
      expect(
        eventRepositoryMock.getBaseQuery('e').delete().where,
      ).toHaveBeenCalledTimes(1);
      expect(
        eventRepositoryMock.getBaseQuery('e').delete().where,
      ).toHaveBeenCalledWith('id = :id', { id: 1 });
      expect(
        eventRepositoryMock
          .getBaseQuery('e')
          .delete()
          .where('id = :id', { id: 1 }).execute,
      ).toHaveBeenCalledTimes(1);
    });
  });

  describe('getEventsAttendedByUserIdPaginated', () => {
    it('should return a list of paginated events', async () => {
      const userId = 1;
      const paginatedOptions: PaginateOptions = {
        limit: 10,
        currentPage: 1,
      };

      paginateMock.mockResolvedValue(
        Promise.resolve({
          first: 1,
          last: 1,
          total: 10,
          limit: 10,
          data: [],
        }),
      );

      const events = await eventsService.getEventsAttendedByUserIdPaginated(
        userId,
        paginatedOptions,
      );
      expect(events).toEqual({
        first: 1,
        last: 1,
        total: 10,
        limit: 10,
        data: [],
      });

      expect(eventRepositoryMock.getBaseQuery).toHaveBeenCalledTimes(1);
      expect(eventRepositoryMock.getBaseQuery).toHaveBeenCalledWith('e');

      expect(
        eventRepositoryMock.getBaseQuery('e').leftJoinAndSelect,
      ).toHaveBeenCalledTimes(1);

      expect(
        eventRepositoryMock
          .getBaseQuery('e')
          .leftJoinAndSelect('e.attendees', 'a').where,
      ).toHaveBeenCalledTimes(1);
      expect(
        eventRepositoryMock
          .getBaseQuery('e')
          .leftJoinAndSelect('e.attendees', 'a').where,
      ).toHaveBeenCalledWith('a.userId = :userId', { userId: 1 });
    });
  });
});
