import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from './entities/patient.entity';
import { PatientsService } from './patients.service';
import { PatientsResolver } from './patients.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Patient])],
  providers: [PatientsService, PatientsResolver],
})
export class PatientsModule {}