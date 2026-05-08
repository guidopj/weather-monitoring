import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WeatherStationsService } from './weather-stations.service';
import { CreateWeatherStationDto } from './dto/create-weather-station.dto';
import { UpdateWeatherStationDto } from './dto/update-weather-station.dto';

@Controller('weather-stations')
export class WeatherStationsController {
  constructor(private readonly weatherStationsService: WeatherStationsService) {}

  @Post()
  create(@Body() createWeatherStationDto: CreateWeatherStationDto) {
    return this.weatherStationsService.create(createWeatherStationDto);
  }

  @Get()
  findAll() {
    return this.weatherStationsService.findAll();
  }

  @Get('by-id/:id')
  findOne(@Param('id') id: string) {
    return this.weatherStationsService.findOne(+id);
  }

  @Get("by-name/:name")
  findByName(@Param("name") name: string){
    return this.weatherStationsService.findByName(name)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWeatherStationDto: UpdateWeatherStationDto) {
    return this.weatherStationsService.update(+id, updateWeatherStationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.weatherStationsService.remove(+id);
  }
}
