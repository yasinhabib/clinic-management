import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Appointment } from './entities/appointment.entity';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentInput } from './dto/create-appointment.input';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Resolver(() => Appointment)
export class AppointmentsResolver {
  constructor(private appointmentsService: AppointmentsService) {}

  @Query(() => [Appointment])
  async appointments(): Promise<Appointment[]> {
    return this.appointmentsService.findAll();
  }

  @Query(() => Appointment)
  async appointment(@Args('id', { type: () => Int }) id: number): Promise<Appointment> {
    return this.appointmentsService.findOne(id);
  }

  @Mutation(() => Appointment)
  @UseGuards(GqlAuthGuard)
  async createAppointment(
    @Args('createAppointmentInput') createAppointmentInput: CreateAppointmentInput,
    @CurrentUser() user: any,
  ): Promise<Appointment> {
    return this.appointmentsService.create(createAppointmentInput, user.userId);
  }

  @Mutation(() => Appointment)
  @UseGuards(GqlAuthGuard)
  async updateAppointment(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateAppointmentInput') updateAppointmentInput: CreateAppointmentInput,
    @CurrentUser() user: any,
  ): Promise<Appointment> {
    return this.appointmentsService.update(id, updateAppointmentInput, user.userId);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteAppointment(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    return this.appointmentsService.remove(id);
  }
}