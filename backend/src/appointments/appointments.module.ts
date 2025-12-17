import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { AppointmentsService } from './appointments.service';
import { AppointmentsResolver } from './appointments.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment])],
  providers: [AppointmentsService, AppointmentsResolver],
})
export class AppointmentsModule {}