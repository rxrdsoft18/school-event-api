import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Subject } from './subject.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { Gender } from '../object-types/school.types';
import { Course } from './course.entity';
import { Paginated } from '../../common/utils/pagination/paginator';

@Entity('teachers')
@ObjectType()
export class Teacher {
  constructor(partial?: Partial<Teacher>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  @Field({ nullable: true })
  id: number;

  @Column()
  @Field({ nullable: true })
  name: string;

  @Column({
    type: 'enum',
    enum: Gender,
    default: Gender.Other,
  })
  @Field()
  gender: Gender;

  @ManyToMany(() => Subject, (subject) => subject.teachers)
  @Field(() => [Subject])
  subjects: Promise<Subject[]>;

  @OneToMany(() => Course, (course) => course.teacher)
  @Field(() => [Course])
  courses: Promise<Course[]>;
}

@ObjectType()
export class PaginatedTeachers extends Paginated<Teacher>(Teacher) {}
