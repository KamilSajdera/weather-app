export type ApiFetch = {
  latitude: number;
  longitude: number;
  tempUnit: string;
};

export interface WeatherResponse {
  latitude: number;
  longitude: number;
  current_weather: {
    temperature: number;
    weathercode: number,
  };
  daily: {
    precipitation_probability_max: number[];
    rain_sum: number[];
  };
  hourly: {
    temperature: number[];
  }
}