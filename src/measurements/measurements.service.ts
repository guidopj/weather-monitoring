import { Injectable, NotFoundException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

import { Measurement } from './entities/measurement.entity';
import { MeasurementRepository } from './domain/repositories/measurement.repository';
import {
  Temperature,
  TemperatureUnit,
} from './domain/valueObjects/temperature';
import { AtmosphericPressure } from './domain/valueObjects/atmosphericPressure';
import { Humidity } from './domain/valueObjects/humidity';
import { TemperatureRange } from './domain/valueObjects/temperatureRange';
import { UpdateMeasurementDto } from './dto/update-measurement.dto';
import { NotificationService } from '../notifications/notifications.service';
import { WeatherStationRepository } from '../weather-stations/domain/repositories/weather-stations.repository';
import { UsersClient } from '../grpc/clients/users.client';

@Injectable()
export class MeasurementService {
  constructor(
    private readonly measurementRepo: MeasurementRepository,
    private readonly weatherStationRepo: WeatherStationRepository,
    private readonly notificationService: NotificationService,
    private readonly usersClient: UsersClient,
  ) {}

  async create(input: {
    weatherStationId: string;
    temperature: number;
    humidity: number;
    atmosphericPressure: number;
  }): Promise<Measurement> {
    const station = await this.weatherStationRepo.findById(
      input.weatherStationId,
    );

    if (!station) {
      throw new NotFoundException('weather station not found');
    }

    const measurement = Measurement.create({
      weatherStationId: input.weatherStationId,
      temperature: Temperature.create(
        input.temperature,
        TemperatureUnit.CELSIUS,
      ),
      humidity: Humidity.create(input.humidity),
      atmosphericPressure: AtmosphericPressure.create(
        input.atmosphericPressure,
      ),
    });

    await this.measurementRepo.create(measurement);

    if (measurement.isAnomaly) {
      const response = await firstValueFrom(
        this.usersClient.findBySubscribedStation(input.weatherStationId),
      );
      const users = response.users;

      for (const user of users) {
        this.notificationService.notify(
          user.email,
          `Alert: ${measurement.alarmType} detected to User: ${user.name}`,
        );
      }
    }

    return measurement;
  }

  async update(measurementId: string, input: UpdateMeasurementDto) {
    const measurement = await this.measurementRepo.findById(measurementId);

    if (!measurement) {
      throw new NotFoundException('Measurement not found');
    }

    if (input.atmosphericPressure !== undefined) {
      measurement.atmosphericPressure = AtmosphericPressure.create(
        input.atmosphericPressure,
      );
    }

    if (input.humidity !== undefined) {
      measurement.humidity = Humidity.create(input.humidity);
    }

    if (input.temperature !== undefined) {
      measurement.temperature = Temperature.create(
        input.temperature,
        measurement.temperature.unit,
      );
    }

    await this.measurementRepo.update(measurementId, measurement);

    return measurement;
  }

  async delete(id: string) {
    await this.measurementRepo.delete(id);
  }

  async findByStationName(weatherStationName: string): Promise<Measurement[]> {
    const weatheStation =
      await this.weatherStationRepo.findByName(weatherStationName);

    if (!weatheStation) return [];

    return this.measurementRepo.findByStationId(weatheStation.id);
  }

  async getHistory(filters: {
    weatherStationId?: string;
    min?: number;
    max?: number;
    onlyAnomalies?: boolean;
  }): Promise<Measurement[]> {
    const temperatureRange =
      filters.min !== undefined && filters.max !== undefined
        ? new TemperatureRange(filters.min, filters.max)
        : undefined;

    return this.measurementRepo.getAllByCriteria({
      weatherStationId: filters.weatherStationId,
      temperatureRange,
      onlyAnomalies: filters.onlyAnomalies,
    });
  }

  async filterByTemperatureRange(
    min?: number,
    max?: number,
    isActive?: boolean,
  ): Promise<Measurement[]> {
    return this.getHistory({
      min,
      max,
      onlyAnomalies: isActive,
    });
  }
}
