import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Course } from '../entities/course.entity';
import { Subject, Teacher } from '../entities';

@Resolver(() => Course)
export class CourseResolver {
  @ResolveField('teacher')
  async teacher(@Parent() course: Course): Promise<Teacher> {
    return await course.teacher;
  }

  @ResolveField('subject')
  async subject(@Parent() course: Course): Promise<Subject> {
    return await course.subject;
  }
}
