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
    const patient = this.patientsRepository.create({
      ...createPatientInput,
      created_by: userId,
      updated_by: userId,
    });
    const savedPatient = await this.patientsRepository.save(patient);
    // Generate kode_pasien
    savedPatient.kode_pasien = `PSN-${savedPatient.id.toString().padStart(6, '0')}`;
    return this.patientsRepository.save(savedPatient);
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