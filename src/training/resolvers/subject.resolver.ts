import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Subject, Teacher } from '../entities';
import { Course } from '../entities/course.entity';

@Resolver(() => Subject)
export class SubjectResolver {
  @ResolveField('teachers', () => [Teacher])
  async teachers(@Parent() subject: Subject): Promise<Teacher[]> {
    return await subject.teachers;
  }

  @ResolveField('courses', () => [Course])
  async courses(@Parent() subject: Subject): Promise<Course[]> {
    return await subject.courses;
  }
}
