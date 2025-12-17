import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { CreatePaymentInput } from './dto/create-payment.input';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
  ) {}

  async create(createPaymentInput: CreatePaymentInput, userId: number): Promise<Payment> {
    // Calculate biaya_obat
    const biayaObat = await this.calculateBiayaObat(createPaymentInput.examinationId);
    const payment = this.paymentsRepository.create({
      ...createPaymentInput,
      tanggal: new Date(createPaymentInput.tanggal),
      biaya_obat: biayaObat,
      created_by: userId,
      updated_by: userId,
    });
    return this.paymentsRepository.save(payment);
  }

  async findAll(): Promise<Payment[]> {
    return this.paymentsRepository.find({ relations: ['examination'] });
  }

  async findOne(id: number): Promise<Payment> {
    const payment = await this.paymentsRepository.findOne({
      where: { id },
      relations: ['examination'],
    });
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
    return payment;
  }

  async update(id: number, updatePaymentInput: Partial<CreatePaymentInput>, userId: number): Promise<Payment> {
    const payment = await this.findOne(id);
    Object.assign(payment, updatePaymentInput);
    if (updatePaymentInput.examinationId) {
      payment.biaya_obat = await this.calculateBiayaObat(updatePaymentInput.examinationId);
    }
    payment.updated_by = userId;
    return this.paymentsRepository.save(payment);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.paymentsRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  private async calculateBiayaObat(examinationId: number): Promise<number> {
    const medicines = await this.paymentsRepository.query(`
      SELECT SUM(harga * jumlah) as total
      FROM medicines
      WHERE examinationId = ?
    `, [examinationId]);
    return medicines[0]?.total || 0;
  }
}