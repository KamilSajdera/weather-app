import { fetchWeather } from "./api/weatherApi";

import type { WeatherResponse } from "./types/weather";


let forecastData = (await fetchWeather({
  latitude: 50.17,
  longitude: 20.0,
  tempUnit: "celsius",
})) as WeatherResponse;


