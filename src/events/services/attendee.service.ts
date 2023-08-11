import { Inject, Injectable } from '@nestjs/common';
import { AttendeesRepositoryInterface } from '../interfaces';
import { Attendee } from '../entities';
import { CreateAttendeeDto } from "../dtos/create-attendee.dto";

@Injectable()
export class AttendeeService {
  constructor(
    @Inject('AttendeesRepositoryInterface')
    private readonly attendeeRepository: AttendeesRepositoryInterface,
  ) {}

  async findByEventId(eventId: number): Promise<Attendee[]> {
    return this.attendeeRepository.findAll({
      where: { eventId },
    });
  }

  async findOneByEventIdAndUserId(
    eventId: number,
    userId: number,
  ): Promise<Attendee | undefined> {
    return this.attendeeRepository.findByCondition({
      where: {
        eventId,
        userId,
      },
    });
  }

  async createOrUpdate(
    createAttendeeDto: CreateAttendeeDto,
    eventId: number,
    userId: number,
  ): Promise<Attendee> {
    const attendee =
      (await this.findOneByEventIdAndUserId(eventId, userId)) ?? new Attendee();

    attendee.eventId = eventId;
    attendee.userId = userId;
    attendee.answer = createAttendeeDto.answer;

    return this.attendeeRepository.save(attendee);
  }
}
