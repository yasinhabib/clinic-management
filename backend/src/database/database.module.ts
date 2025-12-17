import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Patient } from '../patients/entities/patient.entity';
import { Appointment } from '../appointments/entities/appointment.entity';
import { Examination } from '../examinations/entities/examination.entity';
import { Medicine } from '../medicines/entities/medicine.entity';
import { Payment } from '../payments/entities/payment.entity';
import { Workflow } from '../workflows/entities/workflow.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'sqlite',
        database: configService.get<string>('database.path'),
        entities: [User, Patient, Appointment, Examination, Medicine, Payment, Workflow],
        synchronize: configService.get<string>('nodeEnv') === 'development',
        logging: configService.get<string>('nodeEnv') === 'development',
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}