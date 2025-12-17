import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Medicine } from './entities/medicine.entity';
import { CreateMedicineInput } from './dto/create-medicine.input';

@Injectable()
export class MedicinesService {
  constructor(
    @InjectRepository(Medicine)
    private medicinesRepository: Repository<Medicine>,
  ) {}

  async create(createMedicineInput: CreateMedicineInput, userId: number): Promise<Medicine> {
    const medicine = this.medicinesRepository.create({
      ...createMedicineInput,
      created_by: userId,
      updated_by: userId,
    });
    return this.medicinesRepository.save(medicine);
  }

  async findAll(): Promise<Medicine[]> {
    return this.medicinesRepository.find({ relations: ['examination'] });
  }

  async findOne(id: number): Promise<Medicine> {
    const medicine = await this.medicinesRepository.findOne({
      where: { id },
      relations: ['examination'],
    });
    if (!medicine) {
      throw new NotFoundException(`Medicine with ID ${id} not found`);
    }
    return medicine;
  }

  async update(id: number, updateMedicineInput: Partial<CreateMedicineInput>, userId: number): Promise<Medicine> {
    const medicine = await this.findOne(id);
    Object.assign(medicine, updateMedicineInput);
    medicine.updated_by = userId;
    return this.medicinesRepository.save(medicine);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.medicinesRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}