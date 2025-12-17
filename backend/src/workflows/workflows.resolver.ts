import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Workflow } from './entities/workflow.entity';
import { WorkflowsService } from './workflows.service';
import { CreateWorkflowInput } from './dto/create-workflow.input';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Resolver(() => Workflow)
export class WorkflowsResolver {
  constructor(private workflowsService: WorkflowsService) {}

  @Query(() => [Workflow])
  async workflows(): Promise<Workflow[]> {
    return this.workflowsService.findAll();
  }

  @Query(() => Workflow)
  async workflow(@Args('id', { type: () => Int }) id: number): Promise<Workflow> {
    return this.workflowsService.findOne(id);
  }

  @Mutation(() => Workflow)
  @UseGuards(GqlAuthGuard)
  async createWorkflow(
    @Args('createWorkflowInput') createWorkflowInput: CreateWorkflowInput,
    @CurrentUser() user: any,
  ): Promise<Workflow> {
    return this.workflowsService.create(createWorkflowInput, user.userId);
  }

  @Mutation(() => Workflow)
  @UseGuards(GqlAuthGuard)
  async updateWorkflow(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateWorkflowInput') updateWorkflowInput: CreateWorkflowInput,
    @CurrentUser() user: any,
  ): Promise<Workflow> {
    return this.workflowsService.update(id, updateWorkflowInput, user.userId);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteWorkflow(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    return this.workflowsService.remove(id);
  }

  @Mutation(() => Workflow)
  @UseGuards(GqlAuthGuard)
  async updateWorkflowOrder(
    @Args('id', { type: () => Int }) id: number,
    @Args('workflow_order') workflow_order: number,
  ): Promise<Workflow> {
    return this.workflowsService.updateOrder(id, workflow_order);
  }
}