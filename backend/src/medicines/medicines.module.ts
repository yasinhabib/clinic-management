import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Medicine } from './entities/medicine.entity';
import { MedicinesService } from './medicines.service';
import { MedicinesResolver } from './medicines.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Medicine])],
  providers: [MedicinesService, MedicinesResolver],
})
export class MedicinesModule {}