import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  SerializeOptions, UseInterceptors
} from "@nestjs/common";
import { AttendeeService } from './services/attendee.service';

@Controller('events/:eventId/attendees')
@SerializeOptions({ strategy: 'excludeAll' })
export class EventAttendeesController {
  constructor(private readonly attendeeService: AttendeeService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async findAttendeesByEventId(
    @Param('eventId', ParseIntPipe) eventId: number,
  ) {
    return this.attendeeService.findByEventId(eventId);
  }
}
