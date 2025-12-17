import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Medicine } from './entities/medicine.entity';
import { MedicinesService } from './medicines.service';
import { CreateMedicineInput } from './dto/create-medicine.input';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Resolver(() => Medicine)
export class MedicinesResolver {
  constructor(private medicinesService: MedicinesService) {}

  @Query(() => [Medicine])
  async medicines(): Promise<Medicine[]> {
    return this.medicinesService.findAll();
  }

  @Query(() => Medicine)
  async medicine(@Args('id', { type: () => Int }) id: number): Promise<Medicine> {
    return this.medicinesService.findOne(id);
  }

  @Mutation(() => Medicine)
  @UseGuards(GqlAuthGuard)
  async createMedicine(
    @Args('createMedicineInput') createMedicineInput: CreateMedicineInput,
    @CurrentUser() user: any,
  ): Promise<Medicine> {
    return this.medicinesService.create(createMedicineInput, user.userId);
  }

  @Mutation(() => Medicine)
  @UseGuards(GqlAuthGuard)
  async updateMedicine(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateMedicineInput') updateMedicineInput: CreateMedicineInput,
    @CurrentUser() user: any,
  ): Promise<Medicine> {
    return this.medicinesService.update(id, updateMedicineInput, user.userId);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteMedicine(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    return this.medicinesService.remove(id);
  }
}