import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Payment } from './entities/payment.entity';
import { PaymentsService } from './payments.service';
import { CreatePaymentInput } from './dto/create-payment.input';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Resolver(() => Payment)
export class PaymentsResolver {
  constructor(private paymentsService: PaymentsService) {}

  @Query(() => [Payment])
  async payments(): Promise<Payment[]> {
    return this.paymentsService.findAll();
  }

  @Query(() => Payment)
  async payment(@Args('id', { type: () => Int }) id: number): Promise<Payment> {
    return this.paymentsService.findOne(id);
  }

  @Mutation(() => Payment)
  @UseGuards(GqlAuthGuard)
  async createPayment(
    @Args('createPaymentInput') createPaymentInput: CreatePaymentInput,
    @CurrentUser() user: any,
  ): Promise<Payment> {
    return this.paymentsService.create(createPaymentInput, user.userId);
  }

  @Mutation(() => Payment)
  @UseGuards(GqlAuthGuard)
  async updatePayment(
    @Args('id', { type: () => Int }) id: number,
    @Args('updatePaymentInput') updatePaymentInput: CreatePaymentInput,
    @CurrentUser() user: any,
  ): Promise<Payment> {
    return this.paymentsService.update(id, updatePaymentInput, user.userId);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deletePayment(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    return this.paymentsService.remove(id);
  }
}