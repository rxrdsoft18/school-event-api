import { Resolver, Query, Args, Int, Mutation } from '@nestjs/graphql';
import { Teacher } from '../entities';
import { TeacherService } from '../services/teacher.service';
import { CreateTeacher } from '../dtos/input/create-teacher.input';
import { UpdateTeacher } from '../dtos/input/update-teacher.input';
import { EntityWithId } from '../object-types/school.types';

@Resolver(() => Teacher)
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
    @Args('createTeacher', { type: () => CreateTeacher })
    createTeacher: CreateTeacher,
  ): Promise<Teacher> {
    return this.teacherService.createTeacher(createTeacher);
  }

  @Mutation(() => Teacher)
  async updateTeacher(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateTeacher', { type: () => UpdateTeacher })
    updateTeacher: UpdateTeacher,
  ): Promise<Teacher> {
    return this.teacherService.updateTeacher(id, updateTeacher);
  }

  @Mutation(() => EntityWithId)
  async deleteTeacher(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<EntityWithId> {
    return this.teacherService.deleteTeacher(id);
  }
}
