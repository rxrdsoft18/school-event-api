import { IsInt } from 'class-validator';
import { Transform } from 'class-transformer';

export class ListEventOptions {
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  when?: WhenEventOptions = WhenEventOptions.All;

  @IsInt()
  @Transform(({ value }) => parseInt(value))
  page = 1;
}

export enum WhenEventOptions {
  All = 1,
  Today,
  Tommorrow,
  ThisWeek,
  NextWeek,
}
