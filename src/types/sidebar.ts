export interface SidebarData {
  city: string;
  degrees: number;
  weathercode: number,
  description: string;
  chanceOfRain: number;
  imageSrc?: string;
  imageAlt?: string;
  hourly_temp: number[];
}

export interface CitiesApi {
  results: [
    {
      components: {
        city?: string,
        town?: string,
        county?: string,
        village?: string,
        suburb?: string,
        continent: string,
        country: string,
        country_code: string,
        state: string,
        postcode?: string,
        municipality?: string,
      }
      formatted: string,
      geometry: {
        lat: number,
        lng: number
      }
    }
  ],
  status: {
    code: number,
    message: string,
  }
  total_results: number
}