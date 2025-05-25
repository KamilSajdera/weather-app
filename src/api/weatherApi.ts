import { type ApiFetch } from "../types/weather";

export async function fetchWeather(apiData: ApiFetch): Promise<object> {
  const { latitude, longitude, tempUnit } = apiData;
  const endpointURL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=relativehumidity_2m,pressure_msl,visibility,temperature&daily=weathercode,precipitation_probability_max,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,rain_sum,snowfall_sum&current_weather=true&timezone=auto&temperature_unit=${tempUnit}`;

  const response: Response = await fetch(endpointURL);

  if (!response.ok) {
    throw new Error("Error fetching data, try again.");
  }

  const data = await response.json();
  return data;
}
