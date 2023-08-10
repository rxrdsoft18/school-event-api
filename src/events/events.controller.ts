import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { EventsService } from './services/events.service';
import { CreateEventDto } from './dtos/create-event.dto';
import { UpdateEventDto } from './dtos/update-event.dto';
import { ListEventOptions } from './find-options/list-event-options';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../auth/entities';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('events')
@UseGuards(JwtAuthGuard)
@SerializeOptions({ strategy: 'excludeAll' })
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(@Query() options: ListEventOptions) {
    console.log(options);
    return await this.eventsService.findAllWithAttendeeCountFilteredPaginated(
      options,
      {
        total: true,
        currentPage: options.page,
        limit: 10,
      },
    );
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.findOne(id);
  }

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  create(
    @Body(ValidationPipe) createEventDto: CreateEventDto,
    @CurrentUser() user: User,
  ) {
    return this.eventsService.create(createEventDto, user);
  }

  @Patch(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEventDto: UpdateEventDto,
    @CurrentUser() user: User,
  ) {
    return this.eventsService.update(id, updateEventDto, user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: User) {
    // return this.eventsService.delete(id,user);
    return this.eventsService.deleteEvent(id, user);
  }

  @Get('practice/test')
  practice() {
    return this.eventsService.practice();
  }
}
