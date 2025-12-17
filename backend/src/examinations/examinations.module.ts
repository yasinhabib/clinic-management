import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Examination } from './entities/examination.entity';
import { ExaminationsService } from './examinations.service';
import { ExaminationsResolver } from './examinations.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Examination])],
  providers: [ExaminationsService, ExaminationsResolver],
})
export class ExaminationsModule {}