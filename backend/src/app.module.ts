import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PatientsModule } from './patients/patients.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { ExaminationsModule } from './examinations/examinations.module';
import { MedicinesModule } from './medicines/medicines.module';
import { PaymentsModule } from './payments/payments.module';
import { WorkflowsModule } from './workflows/workflows.module';
import { ConfigModule } from '@nestjs/config';
import { envConfig } from './config/env.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envConfig],
      envFilePath: '.env',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/api*', '/graphql*'],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      context: ({ req }) => ({ req }),
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    PatientsModule,
    AppointmentsModule,
    ExaminationsModule,
    MedicinesModule,
    PaymentsModule,
    WorkflowsModule,
  ],
})
export class AppModule {}
