import { WeatherStation } from "../../entities/weather-station.entity";

export type PersistedWeatherStation = WeatherStation & { id: string };