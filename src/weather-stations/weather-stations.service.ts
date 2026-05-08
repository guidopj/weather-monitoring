import { Injectable } from '@nestjs/common';
import { CreateWeatherStationDto } from './dto/create-weather-station.dto';
import { UpdateWeatherStationDto } from './dto/update-weather-station.dto';
import { WeatherStationRepository } from './domain/repositories/weather-stations.repository';

@Injectable()
export class WeatherStationsService {
  constructor(private readonly weatherStationRepo: WeatherStationRepository){}

  create(createWeatherStationDto: CreateWeatherStationDto) {
    return 'This action adds a new weatherStation';
  }

  findAll() {
    return `This action returns all weatherStations`;
  }

  findOne(id: number) {
    return `This action returns aaa #${id} weatherStation`;
  }

  findByName(name: string) {
    return this.weatherStationRepo.findByName(name)
  }

  update(id: number, updateWeatherStationDto: UpdateWeatherStationDto) {
    return `This action updates a #${id} weatherStation`;
  }

  remove(id: number) {
    return `This action removes a #${id} weatherStation`;
  }
}
