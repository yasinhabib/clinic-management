import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workflow } from './entities/workflow.entity';
import { WorkflowsService } from './workflows.service';
import { WorkflowsResolver } from './workflows.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Workflow])],
  providers: [WorkflowsService, WorkflowsResolver],
})
export class WorkflowsModule {}