import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './services/events.service';
import { Event } from './entities';
import { UpdateEventDto } from './dtos/update-event.dto';
import { User } from '../auth/entities';
import { EventsRepositoryInterface } from './interfaces';
import { createMock } from '@golevelup/ts-jest';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('EventsService', () => {
  let eventsService: EventsService;
  const eventRepositoryMock = createMock<EventsRepositoryInterface>();

  beforeEach(async () => {
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

      jest
        .spyOn(eventsService, 'findOne')
        .mockResolvedValue({ id: eventId, organizerId: 2 } as Event);

      eventRepositoryMock.save.mockResolvedValue({
        id: 1,
        address: 'New address',
      } as Event);

      const updatedEvent = await eventsService.update(
        eventId,
        updateEventDto,
        user,
      );
      expect(updatedEvent).toEqual({ id: eventId, address: 'New address' });
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
});
