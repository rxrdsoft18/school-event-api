import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller';
import { EventsService } from './services/events.service';
import { ListEventOptions } from './find-options/list-event-options';
import { User } from '../auth/entities';
import { NotFoundException } from '@nestjs/common';

describe('EventsController', () => {
  let eventsController: EventsController;
  let eventsService: EventsService;

  beforeAll(() => console.log('this logged once'));

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'EventsRepositoryInterface',
          useClass: jest.fn(),
        },
        {
          provide: 'AttendeesRepositoryInterface',
          useClass: jest.fn(),
        },
        EventsService,
      ],
      controllers: [EventsController],
    }).compile();
    eventsController = module.get<EventsController>(EventsController);
    eventsService = module.get<EventsService>(EventsService);
  });

  it('should return list of events', async () => {
    const result = {
      first: 1,
      last: 1,
      limit: 10,
      data: [],
    };

    // eventsService.findAllWithAttendeeCountFilteredPaginated = jest
    //   .fn()
    //   .mockImplementation((): any => result);

    const spy = jest
      .spyOn(eventsService, 'findAllWithAttendeeCountFilteredPaginated')
      .mockImplementation((): any => result);

    expect(await eventsController.findAll(new ListEventOptions())).toEqual(
      result,
    );
    expect(spy).toBeCalledTimes(1);
  });

  it('should not delete an event, when it not found', async () => {
    // const deleteSpy = jest.spyOn(eventsService, 'deleteEvent');
    const findSpy = jest
      .spyOn(eventsService, 'findOne')
      .mockImplementation(() => undefined);

    try {
      await eventsController.remove(1, new User());
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException);
    }
    // expect(deleteSpy).toBeCalledTimes(0);
    expect(findSpy).toBeCalledTimes(1);
  });
});
