import { type ApiFetch } from "../types/weather";

export async function fetchWeather(apiData: ApiFetch): Promise<object> {
  const { latitude, longitude, tempUnit } = apiData;
  const endpointURL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=pressure_msl,visibility,temperature,rain&daily=weathercode,precipitation_probability_max,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,rain_sum,snowfall_sum&current=relative_humidity_2m,temperature_2m,rain,surface_pressure,weather_code,wind_speed_10m&timezone=auto&temperature_unit=${tempUnit}&forecast_days=14`;

  const response: Response = await fetch(endpointURL);

  if (!response.ok) {
    throw new Error("Error fetching data, try again.");
  }

  const data = await response.json();
  return data;
}
