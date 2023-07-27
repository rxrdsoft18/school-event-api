import { Body, Controller, Post } from '@nestjs/common';
import { TrainingService } from './training.service';
import { CreateTrainingDto } from './dtos';

@Controller('training')
export class TrainingController {
  constructor(private readonly trainingService: TrainingService) {}

  @Post('create')
  savingRelation(@Body() createTraining: CreateTrainingDto) {
    return this.trainingService.savingRelation(createTraining);
  }

  @Post('remove')
  removeRelation() {
    return this.trainingService.removeRelation();
  }
}
