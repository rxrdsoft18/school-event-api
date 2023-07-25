import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsRepository } from './repositories/events.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { EventsService } from './events.service';

@Module({
  imports: [TypeOrmModule.forFeature([Event])],
  controllers: [EventsController],
  providers: [
    {
      provide: 'EventsRepositoryInterface',
      useClass: EventsRepository,
    },
    EventsService,
  ],
})
export class EventsModule {}
