import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { CreateAppointmentInput } from './dto/create-appointment.input';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentsRepository: Repository<Appointment>,
  ) {}

  async create(createAppointmentInput: CreateAppointmentInput, userId: number): Promise<Appointment> {
    const appointment = this.appointmentsRepository.create({
      ...createAppointmentInput,
      created_by: userId,
      updated_by: userId,
    });
    return this.appointmentsRepository.save(appointment);
  }

  async findAll(): Promise<Appointment[]> {
    return this.appointmentsRepository.find({ relations: ['patient'] });
  }

  async findOne(id: number): Promise<Appointment> {
    const appointment = await this.appointmentsRepository.findOne({
      where: { id },
      relations: ['patient'],
    });
    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }
    return appointment;
  }

  async update(id: number, updateAppointmentInput: Partial<CreateAppointmentInput>, userId: number): Promise<Appointment> {
    const appointment = await this.findOne(id);
    Object.assign(appointment, updateAppointmentInput);
    appointment.updated_by = userId;
    return this.appointmentsRepository.save(appointment);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.appointmentsRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}