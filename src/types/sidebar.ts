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
