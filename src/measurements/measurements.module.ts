import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

import { MeasurementService } from './measurements.service';
import { MeasurementsController } from './measurements.controller';
import { MeasurementRepository } from './domain/repositories/measurement.repository';
import { MongoMeasurementRepository } from './infrastructure/persistence/mongodb-measurement.repository';
import { MeasurementSchema } from './infrastructure/persistence/measurement.schema';
import { WeatherStationsModule } from '../weather-stations/weather-stations.module';
import { NotificationService } from '../notifications/notifications.service';
import { UsersClient } from '../grpc/clients/users.client';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Measurement', schema: MeasurementSchema },
    ]),
    ClientsModule.register([
      {
        name: 'USERS_PACKAGE',

        transport: Transport.GRPC,

        options: {
          url: 'localhost:50051',
          package: 'users',
          protoPath: join(process.cwd(), '../shared/proto/users.proto'),
        },
      },
    ]),
    WeatherStationsModule,
  ],
  controllers: [MeasurementsController],

  providers: [
    MeasurementService,
    NotificationService,
    UsersClient,
    {
      provide: MeasurementRepository,
      useClass: MongoMeasurementRepository,
    },
  ],
  exports: [MeasurementRepository],
})
export class MeasurementsModule {}
