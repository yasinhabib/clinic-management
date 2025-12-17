import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './entities/patient.entity';
import { CreatePatientInput } from './dto/create-patient.input';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private patientsRepository: Repository<Patient>,
  ) {}

  async create(createPatientInput: CreatePatientInput, userId: number): Promise<Patient> {
    // Get next ID for kode_pasien generation
    const maxIdResult = await this.patientsRepository
      .createQueryBuilder('patient')
      .select('MAX(patient.id)', 'maxId')
      .getRawOne();
    const nextId = (maxIdResult?.maxId || 0) + 1;
    const kode_pasien = `PSN-${nextId.toString().padStart(6, '0')}`;

    const patient = this.patientsRepository.create({
      ...createPatientInput,
      kode_pasien,
      created_by: userId,
      updated_by: userId,
    });
    return this.patientsRepository.save(patient);
  }

  async findAll(): Promise<Patient[]> {
    return this.patientsRepository.find();
  }

  async findOne(id: number): Promise<Patient> {
    const patient = await this.patientsRepository.findOne({
      where: { id },
    });
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
    return patient;
  }

  async update(id: number, updatePatientInput: Partial<CreatePatientInput>, userId: number): Promise<Patient> {
    const patient = await this.findOne(id);
    Object.assign(patient, updatePatientInput);
    patient.updated_by = userId;
    return this.patientsRepository.save(patient);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.patientsRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}