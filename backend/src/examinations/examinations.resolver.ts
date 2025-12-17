import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Examination } from './entities/examination.entity';
import { ExaminationsService } from './examinations.service';
import { CreateExaminationInput } from './dto/create-examination.input';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Resolver(() => Examination)
export class ExaminationsResolver {
  constructor(private examinationsService: ExaminationsService) {}

  @Query(() => [Examination])
  async examinations(): Promise<Examination[]> {
    return this.examinationsService.findAll();
  }

  @Query(() => Examination)
  async examination(@Args('id', { type: () => Int }) id: number): Promise<Examination> {
    return this.examinationsService.findOne(id);
  }

  @Mutation(() => Examination)
  @UseGuards(GqlAuthGuard)
  async createExamination(
    @Args('createExaminationInput') createExaminationInput: CreateExaminationInput,
    @CurrentUser() user: any,
  ): Promise<Examination> {
    return this.examinationsService.create(createExaminationInput, user.userId);
  }

  @Mutation(() => Examination)
  @UseGuards(GqlAuthGuard)
  async updateExamination(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateExaminationInput') updateExaminationInput: CreateExaminationInput,
    @CurrentUser() user: any,
  ): Promise<Examination> {
    return this.examinationsService.update(id, updateExaminationInput, user.userId);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteExamination(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    return this.examinationsService.remove(id);
  }
}