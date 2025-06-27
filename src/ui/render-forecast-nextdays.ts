import lottie from 'lottie-web/build/player/lottie_svg';
import { GenerateIcon } from "./generate-weather-icon";

const closestForecastContainer: HTMLDivElement = document.querySelector(
  ".forecast-next-days"
)!;

export function ForecastNextDays(data: Record<string, string[] | number[]>) {

  closestForecastContainer.innerHTML = "";

  for (let i = 0; i < 6; i++) {
    const div = document.createElement("div");
    div.classList.add("forecast-item");

    const thisDayDate = new Date(data.time[i]);
    
    const formatWeekday = thisDayDate.toLocaleDateString("en-US", {
        weekday: "long"
    });
    const formatDate = thisDayDate.toLocaleDateString("pl-Pl", {
        day: "2-digit",
        month: "numeric"
    });

    div.innerHTML = `   <h4>${formatWeekday}</h4>
                        <p class="item-date">${formatDate}</p>
                        <div class="item-icon"></div>
                        <div class="item-temp">${data.temperature_2m_max[i]}°C
                            <span class="temp-night">(${data.temperature_2m_min[i]})</span>
                        </div>`;
                        
    lottie.loadAnimation({
      container: div.querySelector(".item-icon")!,
      renderer: "svg",
      loop: true,
      autoplay: true,
      path: GenerateIcon(+data.weathercode[i] as number),
    });

    closestForecastContainer.appendChild(div);
  }
}
