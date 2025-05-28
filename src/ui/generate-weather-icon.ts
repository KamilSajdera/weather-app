const weatherIconMap: Record<number, string> = {
 0: "sun.json",
 1: "sun.json",
 2: "sun_clouds.json",
 3: "clouds.json",
 45: "fog.json",
 48: "fog.json",
 51: "clouds.json",
 53: "sun_clouds_rain.json",
 55: "sun_clouds_rain.json",
 56: "clouds.json",
 57: "sun_clouds_rain.json",
 61: "clouds.json",
 63: "sun_clouds_rain.json",
 65: "sun_clouds_rain.json",
 71: "snow_sun.json",
 73: "snow_sun.json",
 75: "snow.json",
 77: "snow.json",
 80: "sun_clouds_rain.json",
 81: "sun_clouds_rain.json",
 82: "sun_clouds_rain.json",
 85: "snow_sun.json",
 86: "snow.json",
 95: "thunderstorm_big.json",
 96: "thunderstorm_big.json",
 99: "thunderstorm_big.json",
}

export function GenerateIcon (weatherCode: number):string {
    let formatFileIcon: string = weatherIconMap[weatherCode] ?? "default.js";
    return `./animations/${formatFileIcon}`;
}