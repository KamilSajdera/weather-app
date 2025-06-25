export type ApiFetch = {
  latitude: number;
  longitude: number;
  tempUnit: string;
};

export interface WeatherResponse {
  latitude: number;
  longitude: number;
  current: {
    temperature_2m: number;
    weather_code: number,
    wind_speed_10m: number,
    rain: number,
    relative_humidity_2m: number,
    surface_pressure: number
  };
  daily: {
    precipitation_probability_max: number[],
    rain_sum: number[],
    uv_index_max: number[],
    sunrise: string[],
    sunset: string[],
  };
  hourly: {
    temperature: number[];
    rain: number[];
  }
}