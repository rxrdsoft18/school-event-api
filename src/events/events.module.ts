import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsRepository, AttendeesRepository } from './repositories';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event, Attendee } from './entities';
import { EventsService } from './events.service';

@Module({
  imports: [TypeOrmModule.forFeature([Event, Attendee])],
  controllers: [EventsController],
  providers: [
    {
      provide: 'EventsRepositoryInterface',
      useClass: EventsRepository,
    },
    {
      provide: 'AttendeesRepositoryInterface',
      useClass: AttendeesRepository,
    },
    EventsService,
  ],
})
export class EventsModule {}
