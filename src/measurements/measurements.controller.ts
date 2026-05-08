import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MeasurementService } from './measurements.service';
import { CreateMeasurementDto } from './dto/create-measurement.dto';
import { UpdateMeasurementDto } from './dto/update-measurement.dto';

@Controller('measurements')
export class MeasurementsController {
  constructor(private readonly measurementsService: MeasurementService) {}

  @Post()
  create(@Body() createMeasurementDto: CreateMeasurementDto) {
    return this.measurementsService.create(createMeasurementDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMeasurementDto: UpdateMeasurementDto) {
    return this.measurementsService.update(id, updateMeasurementDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.measurementsService.delete(id);
  }
}
