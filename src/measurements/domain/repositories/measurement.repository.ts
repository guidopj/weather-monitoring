import { Measurement } from "../../entities/measurement.entity";
import { TemperatureRange } from "../valueObjects/temperatureRange";

//PORT
export abstract class MeasurementRepository {
  abstract create(measurement: Measurement): Promise<void>;

  abstract update(id: string, measurement: Measurement): Promise<void>;

  abstract findByStationId(id: string): Promise<Measurement[]>;

  abstract findById(id: string): Promise<Measurement | null>;

  abstract delete(id: string): Promise<Measurement | null>;

  abstract getAllByCriteria(criteria: {
    weatherStationId?: string;
    temperatureRange?: TemperatureRange;
    onlyAnomalies?: boolean;
  }): Promise<any[]>;
}