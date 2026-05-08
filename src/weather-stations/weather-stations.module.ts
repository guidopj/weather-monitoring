import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';

import { WeatherStationsService } from './weather-stations.service';
import { WeatherStationsController } from './weather-stations.controller';
import { WeatherStationRepository } from './domain/repositories/weather-stations.repository';
import { MongoWeatherStationRepository } from './infrastructure/persistence/mongodb-weather-stations.repository';
import { WeatherStationSchema } from './infrastructure/persistence/weather-station.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'WeatherStation', schema: WeatherStationSchema },
    ]),
  ],

  controllers: [WeatherStationsController],
  providers: [
    WeatherStationsService,
    {
      provide: WeatherStationRepository,
      useClass: MongoWeatherStationRepository,
    },
  ],
  exports: [WeatherStationRepository]
})
export class WeatherStationsModule {}
