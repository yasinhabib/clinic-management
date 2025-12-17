import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workflow } from './entities/workflow.entity';
import { CreateWorkflowInput } from './dto/create-workflow.input';

@Injectable()
export class WorkflowsService {
  constructor(
    @InjectRepository(Workflow)
    private workflowsRepository: Repository<Workflow>,
  ) {}

  async create(createWorkflowInput: CreateWorkflowInput, userId: number): Promise<Workflow> {
    const maxOrder = await this.getMaxWorkflowOrder();
    const workflow = this.workflowsRepository.create({
      ...createWorkflowInput,
      workflow_order: maxOrder + 1,
      created_by: userId,
      updated_by: userId,
    });
    return this.workflowsRepository.save(workflow);
  }

  async findAll(): Promise<Workflow[]> {
    return this.workflowsRepository.find({ order: { workflow_order: 'ASC' } });
  }

  async findOne(id: number): Promise<Workflow> {
    const workflow = await this.workflowsRepository.findOne({
      where: { id },
    });
    if (!workflow) {
      throw new NotFoundException(`Workflow with ID ${id} not found`);
    }
    return workflow;
  }

  async update(id: number, updateWorkflowInput: Partial<CreateWorkflowInput>, userId: number): Promise<Workflow> {
    const workflow = await this.findOne(id);
    Object.assign(workflow, updateWorkflowInput);
    workflow.updated_by = userId;
    return this.workflowsRepository.save(workflow);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.workflowsRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  private async getMaxWorkflowOrder(): Promise<number> {
    const result = await this.workflowsRepository
      .createQueryBuilder('workflow')
      .select('MAX(workflow.workflow_order)', 'max')
      .getRawOne();
    return result?.max || 0;
  }
}