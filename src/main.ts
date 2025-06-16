import { fetchWeather } from "./api/weatherApi";
import { SidebarInput } from "./ui/renderSidebar";
import { ForecastNextDays } from "./ui/render-forecast-nextdays";

import type { WeatherResponse } from "./types/weather";
import type { SidebarData } from "./types/sidebar";
import type { HighlightCard, MatchedNames } from "./types/main";
import { fetchCities } from "./api/searchCitiesApi";
import { createCard } from "./ui/highlight-card";
import { getCurrentPosition } from "./api/getCurrentLocation";

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
const currentWeatherCards: HTMLDivElement =
  document.querySelector(".highlight-cards")!;

const trackUserBtn: HTMLDivElement = document.querySelector(".track-user")!;

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

let sidebarData: SidebarData = {
  city: currentCityName,
  degrees: forecastData.current.temperature_2m,
  weathercode: forecastData.current.weather_code,
  description: describePrecipitation(
    forecastData.daily.precipitation_probability_max[0]
  ),
  chanceOfRain: forecastData.daily.precipitation_probability_max[0],
  hourly_temp: forecastData.hourly.temperature,
};

let sidebarTemplate = new SidebarInput(sidebarData);
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

function defer<T extends (...args: any[]) => void>(fn: T, delay: number) {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

searchCityInput.addEventListener(
  "input",
  defer(async (event) => {
    let index = 0;
    const { value: inputValue } = event.target as HTMLInputElement;
    const loadingIndicator: HTMLDivElement =
      searchCitiesContainer.querySelector(".loading-cities")!;

    const p = document.createElement("p");
    p.classList.add("no-results");
    p.innerText = "No results found.";

    if (inputValue.trim().length < 3) {
      searchCitiesContainer.style.display = "none";
      return;
    }

    const oldItems = searchCitiesContainer.querySelectorAll(".city-item");
    oldItems.forEach((item) => item.remove());
    const oldNoResults = searchCitiesContainer.querySelector(".no-results");
    if (oldNoResults) oldNoResults.remove();

    searchCitiesContainer.style.display = "block";
    loadingIndicator.style.display = "flex";

    const data = await fetchCities(inputValue, loadingIndicator);

    if (!data || data.total_results <= 0) {
      if (!searchCitiesContainer.innerHTML.includes("no-results"))
        searchCitiesContainer.appendChild(p);

      return;
    }

    data.results.forEach((item) => {
      const names = matchBestNames(item.components, item.formatted);

      const { geometry } = item;

      const div = document.createElement("div");
      div.addEventListener("click", () => {
        getWeatherForUser(geometry.lat, geometry.lng, names.mainName);
      });
      div.classList.add("city-item");
      div.innerHTML = `
                <h4>${names.mainName}</h4>
                <span class="city-item-region">${names.captions
                  .slice(0, 2)
                  .join(", ")}</span>
                <img
                  src="https://flagcdn.com/${
                    data.results[index]?.components.country_code
                  }.svg"
                  alt="pl"
                  class="city-item-flag"
                />
              `;
      searchCitiesContainer.appendChild(div);
    });
  }, 200)
);

async function getWeatherForUser(
  lat: number,
  lng: number,
  locationName: string
) {
  try {
    const newData = (await fetchWeather({
      latitude: lat,
      longitude: lng,
      tempUnit: "celsius",
    })) as WeatherResponse;

    forecastData = newData;
    currentCityName = locationName;

    highlightData[0].data = forecastData.daily.uv_index_max[0];
    highlightData[1].data = forecastData.current.wind_speed_10m;
    (highlightData[2].data = {
      sunrise: forecastData.daily.sunrise[0],
      sunset: forecastData.daily.sunset[0],
    }),
      (highlightData[3].data = forecastData.current.relative_humidity_2m);
    highlightData[4].data = forecastData.current.surface_pressure;

    sidebarData = {
      city: currentCityName,
      degrees: forecastData.current.temperature_2m,
      weathercode: forecastData.current.weather_code,
      description: describePrecipitation(
        forecastData.daily.precipitation_probability_max[0]
      ),
      chanceOfRain: forecastData.daily.precipitation_probability_max[0],
      hourly_temp: forecastData.hourly.temperature,
    };

    highlightData;

    sidebarTemplate.destroy();
    sidebarTemplate = new SidebarInput(sidebarData);
    sidebarTemplate.createTempsAxis();

    ForecastNextDays(forecastData.daily);

    currentWeatherCards.innerHTML = "";
    highlightData.forEach((item) =>
      currentWeatherCards.appendChild(createCard(item))
    );

    searchCitiesContainer.style.display = "none";
  } catch {}
}

const mainNameTypeMap: Record<string, string[]> = {
  village: ["village"],
  hamlet: ["hamlet", "village", "locality"],
  road: ["road", "residential", "pedestrian"],
  city: ["city", "town"],
  town: ["town", "city"],
  country: ["country"],
  mountain_range: ["mountain_range", "_normalized_city"],
  neighbourhood: ["neighbourhood", "suburb", "city_district"],
  restaurant: ["restaurant", "_normalized_city"],
  point_of_interest: ["point_of_interest", "_normalized_city"],
  monument: ["monument"],
  peak: ["peak"],
  building: ["building"],
  arts_centre: ["arts_centre"],
  community_centre: ["community_centre"],
  pub: ["pub"],
  hotel: ["hotel"],
  pitch: ["pitch"],
  county: ["county"],
  postcode: ["village", "town", "city", "postcode"],
  state: ["state"],
};

const captionTypeMap: Record<string, string[]> = {
  village: ["municipality", "county", "state", "region"],
  hamlet: ["municipality", "county", "_normalized_city", "state"],
  road: ["village", "city", "municipality", "county", "postcode"],
  city: ["municipality", "county", "state", "postcode"],
  town: ["municipality", "county", "state", "postcode"],
  country: ["continent", "political_union"],
  mountain_range: ["municipality", "county", "state"],
  neighbourhood: ["town", "city", "municipality", "county", "state"],
  restaurant: ["municipality", "county", "state"],
  point_of_interest: ["local_administrative_area", "state", "county"],
  monument: ["_normalized_city", "state", "municipality"],
  peak: ["county", "peak"],
  building: ["road", "_normalized_city", "quarter"],
  arts_centre: ["city", "state", "state_district"],
  community_centre: ["_normalized_city", "road", "state"],
  pub: ["road", "city", "neighbourhood", "county"],
  hotel: ["road", "city", "neighbourhood", "county"],
  pitch: ["road", "city", "neighbourhood", "county"],
  county: ["state", "county"],
  postcode: ["village", "town", "city", "postcode"],
  state: ["country", "continent"],
};

function matchBestNames(
  components: Record<string, string>,
  fallback: string
): MatchedNames {
  const type: string = components._type;
  let mainName: string = "";
  let captions: string[] = [];

  const preferredNames = mainNameTypeMap[type] ?? [];
  const preferredCaptions = captionTypeMap[type] ?? [];

  for (const title of preferredNames) {
    if (components[title]) {
      mainName =
        type === "road" ? `ul. ${components[title]}` : components[title];
      break;
    }
  }

  for (const caption of preferredCaptions) {
    if (components[caption]) {
      captions.push(components[caption]);
    }
  }

  if (mainName.length <= 0) mainName = fallback;

  return {
    mainName: mainName,
    captions,
  };
}

let highlightData: HighlightCard[] = [
  {
    name: "UV Index",
    data: forecastData.daily.uv_index_max[0],
    iconFile: "uvindex.json",
    iconSize: "75",
  },
  {
    name: "Wind Status",
    data: forecastData.current.wind_speed_10m,
    iconFile: "wind.json",
    iconSize: "55",
  },
  {
    name: "Sunrise & Sunset",
    data: {
      sunrise: forecastData.daily.sunrise[0],
      sunset: forecastData.daily.sunset[0],
    },
    iconFile: "sunrise.json",
    iconSize: "85",
  },
  {
    name: "Humidity",
    data: forecastData.current.relative_humidity_2m,
    iconFile: "humidity.json",
    iconSize: "60",
  },
  {
    name: "Atmospheric pressure",
    data: forecastData.current.surface_pressure,
    iconFile: "pressure.json",
    iconSize: "45",
  },
];

highlightData.forEach((item) =>
  currentWeatherCards.appendChild(createCard(item))
);

trackUserBtn.addEventListener("click", () => {
  let geo: Geolocation = navigator.geolocation;

  if (geo) {
    geo.getCurrentPosition(async (location) => {
      const { longitude } = location.coords;
      const { latitude } = location.coords;

      const usersCityName = await getCurrentPosition(longitude, latitude);

      currentCityName = usersCityName.geonames[0]?.name;
      getWeatherForUser(latitude, longitude, currentCityName);
    });
  }
});
