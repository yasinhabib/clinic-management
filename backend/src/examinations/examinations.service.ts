import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Examination } from './entities/examination.entity';
import { CreateExaminationInput } from './dto/create-examination.input';

@Injectable()
export class ExaminationsService {
  constructor(
    @InjectRepository(Examination)
    private examinationsRepository: Repository<Examination>,
  ) {}

  async create(createExaminationInput: CreateExaminationInput, userId: number): Promise<Examination> {
    const examination = this.examinationsRepository.create({
      ...createExaminationInput,
      created_by: userId,
      updated_by: userId,
    });
    return this.examinationsRepository.save(examination);
  }

  async findAll(): Promise<Examination[]> {
    return this.examinationsRepository.find({ relations: ['appointment'] });
  }

  async findOne(id: number): Promise<Examination> {
    const examination = await this.examinationsRepository.findOne({
      where: { id },
      relations: ['appointment'],
    });
    if (!examination) {
      throw new NotFoundException(`Examination with ID ${id} not found`);
    }
    return examination;
  }

  async update(id: number, updateExaminationInput: Partial<CreateExaminationInput>, userId: number): Promise<Examination> {
    const examination = await this.findOne(id);
    Object.assign(examination, updateExaminationInput);
    examination.updated_by = userId;
    return this.examinationsRepository.save(examination);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.examinationsRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}