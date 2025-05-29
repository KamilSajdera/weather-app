import { fetchWeather } from "./api/weatherApi";
import { SidebarInput } from "./ui/renderSidebar";
import { ForecastNextDays } from "./ui/render-forecast-nextdays";

import type { WeatherResponse } from "./types/weather";
import type { CitiesApi, SidebarData } from "./types/sidebar";

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

const searchCityInput: HTMLInputElement = document.getElementById(
  "searching-town"
)! as HTMLInputElement;
const searchCitiesContainer: HTMLDivElement =
  document.querySelector(".cities-container")!;

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

searchCityInput.addEventListener("input", async (event) => {
  let index = 0;
  const { value: inputValue } = event.target as HTMLInputElement;
  const loadingIndicator: HTMLDivElement =
    searchCitiesContainer.querySelector(".loading-cities")!;

  if (inputValue.trim().length < 3) {
    searchCitiesContainer.style.display = "none";
    return;
  }

  const oldItems = searchCitiesContainer.querySelectorAll(".city-item");
  oldItems.forEach((item) => item.remove());

  searchCitiesContainer.style.display = "block";
  loadingIndicator.style.display = "flex";
  

  try {
    const fetchCities = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${inputValue}&key=1304a941dc074690a858f246327825e4&language=pl`
    );

    const data: CitiesApi = await fetchCities.json();
  
    while (index < data.total_results) {
      const div = document.createElement("div");
      div.classList.add("city-item");
      div.innerHTML = `
                <h4>${
                  data.results[index]?.components?.suburb ??
                  data.results[index]?.components?.village ??
                  data.results[index]?.components?.city ??
                  data.results[index]?.components?.town ??
                  data.results[index]?.components?.county ??
                  data.results[index].formatted
                }</h4>
                <span class="city-item-region">${
                  data.results[index].components.state ??
                  data.results[index].components.postcode
                } [${
        data.results[index].components.postcode ??
        data.results[index].components.municipality ??
        data.results[index].components.city ??
        data.results[index].components.country_code
      }]</span>
                
                <img
                  src="https://flagcdn.com/${
                    data.results[index]?.components.country_code
                  }.svg"
                  alt="pl"
                  class="city-item-flag"
                />
              `;
      searchCitiesContainer.appendChild(div);
      index++;
    }
  } catch (error) {
    console.error("ERROR!", error);
  } finally {
    loadingIndicator.style.display = "none";
  }
});
