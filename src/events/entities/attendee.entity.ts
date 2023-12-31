import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Event } from './event.entity';
import { Expose } from 'class-transformer';
import { User } from '../../auth/entities';

export enum AttendeeAnswerEnum {
  Accepted = 1,
  Maybe,
  Rejected,
}

@Entity('attendees')
export class Attendee {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @ManyToOne(() => Event, (event) => event.attendees, {
    onDelete: 'CASCADE',
  })
  event: Event;

  @Column({ nullable: true })
  eventId: number;

  @Column('enum', {
    enum: AttendeeAnswerEnum,
    default: AttendeeAnswerEnum.Accepted,
  })
  @Expose()
  answer: AttendeeAnswerEnum;

  @ManyToOne(() => User, (user) => user.attended)
  @Expose()
  user: User;

  @Column({ nullable: true })
  userId: number;
}
