import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WeatherStationsModule } from './weather-stations/weather-stations.module';
import { MeasurementsModule } from './measurements/measurements.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const user = config.getOrThrow<string>('MONGO_USER');
        const pass = encodeURIComponent(
          config.getOrThrow<string>('MONGO_PASS'),
        );
        const db = config.getOrThrow<string>('MONGO_DB');

        const uri = `mongodb+srv://${user}:${pass}@ac-xxxx.a72wqxl.mongodb.net/${db}?retryWrites=true&w=majority`;

        return {
          uri,
        };
      },
    }),
    WeatherStationsModule,
    MeasurementsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
