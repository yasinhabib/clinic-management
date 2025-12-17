import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Patient } from './entities/patient.entity';
import { PatientsService } from './patients.service';
import { CreatePatientInput } from './dto/create-patient.input';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Resolver(() => Patient)
export class PatientsResolver {
  constructor(private patientsService: PatientsService) {}

  @Query(() => [Patient])
  async patients(): Promise<Patient[]> {
    return this.patientsService.findAll();
  }

  @Query(() => Patient)
  async patient(@Args('id', { type: () => Int }) id: number): Promise<Patient> {
    return this.patientsService.findOne(id);
  }

  @Mutation(() => Patient)
  @UseGuards(GqlAuthGuard)
  async createPatient(
    @Args('createPatientInput') createPatientInput: CreatePatientInput,
    @CurrentUser() user: any,
  ): Promise<Patient> {
    return this.patientsService.create(createPatientInput, user.userId);
  }

  @Mutation(() => Patient)
  @UseGuards(GqlAuthGuard)
  async updatePatient(
    @Args('id', { type: () => Int }) id: number,
    @Args('updatePatientInput') updatePatientInput: CreatePatientInput,
    @CurrentUser() user: any,
  ): Promise<Patient> {
    return this.patientsService.update(id, updatePatientInput, user.userId);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deletePatient(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    return this.patientsService.remove(id);
  }
}