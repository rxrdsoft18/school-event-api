import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsRepository, AttendeesRepository } from './repositories';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event, Attendee } from './entities';
import { EventsService } from './services/events.service';
import { AttendeeService } from './services/attendee.service';
import { EventAttendeesController } from './event-attendees.controller';
import { EventOrganizedUserController } from './event-organized-user.controller';
import { CurrentUserEventAttendanceController } from './current-user-event-attendance.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Event, Attendee])],
  controllers: [
    EventsController,
    EventAttendeesController,
    EventOrganizedUserController,
    CurrentUserEventAttendanceController,
  ],
  providers: [
    {
      provide: 'EventsRepositoryInterface',
      useClass: EventsRepository,
    },
    EventsService,
    AttendeeService,
  ],
})
export class EventsModule {}
