import { Resolver, Query, Args, Int, Mutation } from '@nestjs/graphql';
import { Teacher } from '../entities';
import { TeacherService } from '../services/teacher.service';
import { CreateTeacher } from '../dtos/args/create-teacher.args';

@Resolver()
export class TeacherResolver {
  constructor(private readonly teacherService: TeacherService) {}

  @Query(() => [Teacher])
  async teachers(): Promise<Teacher[]> {
    return this.teacherService.getTeachers();
  }

  @Query(() => Teacher)
  async teacher(@Args('id', { type: () => Int }) id: number): Promise<Teacher> {
    return this.teacherService.getTeacher(id);
  }

  @Mutation(() => Teacher)
  async createTeacher(
    @Args('createTeacher') createTeacher: CreateTeacher,
  ): Promise<Teacher> {
    return this.teacherService.createTeacher(createTeacher);
  }
}
