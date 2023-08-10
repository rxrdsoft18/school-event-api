import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  SerializeOptions, UseInterceptors
} from "@nestjs/common";
import { EventsService } from './services/events.service';

@Controller('events-organized-by-user/:userId')
@SerializeOptions({ strategy: 'excludeAll' })
export class EventOrganizedUserController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async findEventsOrganizedByUserId(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('page') page = 1,
  ) {
    return this.eventsService.getEventsOrganizedByUserIdPaginated(userId, {
      total: true,
      currentPage: page,
      limit: 5,
    });
  }
}
