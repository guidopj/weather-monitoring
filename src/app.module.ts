import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WeatherStationsModule } from './weather-stations/weather-stations.module';
import { MeasurementsModule } from './measurements/measurements.module';

@Module({
  imports: [WeatherStationsModule, MeasurementsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
