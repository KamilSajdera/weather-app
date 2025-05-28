import { fetchWeather } from "./api/weatherApi";
import { SidebarInput } from "./ui/renderSidebar";
import { ForecastNextDays } from "./ui/render-forecast-nextdays";

import type { WeatherResponse } from "./types/weather";
import type { SidebarData } from "./types/sidebar";

let currentCityName: string = "Warszawa";

let settingDescriptions: string[] = [
  "Set the temperature unit to Celsius",
  "Set the temperature unit to Fahrenheit",
  "Light/dark mode",
  "Save current location as default",
];

const settingsMenu: HTMLDivElement = document.querySelector(".main-settings")!;
const settingItem: NodeListOf<HTMLDivElement> =
  settingsMenu.querySelectorAll(".settings-item");
const settigsPrompt: HTMLDivElement =
  document.querySelector(".settings-tooltip")!;

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
  weathercode: forecastData.current_weather.weathercode,
  description: describePrecipitation(
    forecastData.daily.precipitation_probability_max[0]
  ),
  chanceOfRain: forecastData.daily.precipitation_probability_max[0],
  hourly_temp: forecastData.hourly.temperature,
};

const sidebarTemplate = new SidebarInput(sidebarData);
sidebarTemplate.createTempsAxis();

ForecastNextDays(forecastData.daily);

window.addEventListener("resize", () => {
  sidebarTemplate.createTempsAxis();
});

settingItem.forEach((item, i) => {
  item.addEventListener("mouseover", () => {
    settigsPrompt.textContent = settingDescriptions[i];
  });
});
