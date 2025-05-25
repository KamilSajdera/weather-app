import { fetchWeather } from "./api/weatherApi";
import { SidebarInput } from "./ui/renderSidebar";

import type { WeatherResponse } from "./types/weather";
import type { SidebarData } from "./types/sidebar";

let currentCityName: string = "Warszawa";

let forecastData = (await fetchWeather({
  latitude: 43.17,
  longitude: 31.0,
  tempUnit: "celsius",
})) as WeatherResponse;

function describePrecipitation(chance: number): string {
  if (chance < 30) return "Low chance of precipitation";
  if (chance < 55) return "Mid chance of precipitation";
  if (chance < 85) return "High chance of precipitation";
  return "Expect rain today";
}

const sidebarData: SidebarData = {
  city: currentCityName,
  degrees: forecastData.current_weather.temperature,
  description: describePrecipitation(
    forecastData.daily.precipitation_probability_max[0]
  ),
  chanceOfRain: forecastData.daily.precipitation_probability_max[0],
};

new SidebarInput(sidebarData);
