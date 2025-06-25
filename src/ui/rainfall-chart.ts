type Range = "daily" | "hourly";

let range: Range = "hourly";

const items: HTMLDivElement = document.querySelector(".rainfall-items")!;
const rangeChoice: HTMLDivElement = document.querySelector(
  ".rainfall-scope-choice"
)!;
const rangeOptions: HTMLUListElement = document.querySelector(
  ".rainfall-scope-options"
)!;
const rangeText: HTMLSpanElement = document.querySelector(
  "#rainfall-scope-text"
)!;
let storedHourlyRainfall: number[];
let storedDailyRainfall: number[];

export function createRainfallItems(
  hourlyRainfall: number[],
  dailyRainfall: number[],
  setToDefaultValue: boolean
) {
  items.innerHTML = "";
  storedDailyRainfall = dailyRainfall;
  storedHourlyRainfall = hourlyRainfall;

  if (setToDefaultValue) {
    range = "hourly";
    rangeText.textContent = "Hourly";
  }

  const rainfall: number[] =
    range === "daily" ? dailyRainfall : hourlyRainfall.slice(0, 24);

  const now = new Date();
  const max = Math.max(...rainfall);

  rainfall.forEach((item, index) => {
    const div = document.createElement("div");
    div.classList.add("rainfall-item");

    const moment = new Date(now);
    let momentLabel = "";

    if (range === "hourly") {
      moment.setHours(now.getHours() + index);
      const hour = moment.getHours().toString().padStart(2, "0");
      momentLabel = `${hour}:00`;
    } else {
      moment.setDate(now.getDate() + index);
      const day = moment.getDate().toString().padStart(2, "0");
      const month = (moment.getMonth() + 1).toString().padStart(2, "0");
      momentLabel = `${day}.${month}`;
    }

    const calculatedHeight: number = calculateHeight(item, max);

    div.innerHTML = ` 
      <div class="rainfall-amount">
        <i class="fa-solid fa-droplet"></i>
        ${item}mm
      </div>
      <div class="rainfall-column" style="height:${calculatedHeight}%"></div>
      <div class="rainfall-moment">${momentLabel}</div>
    `;

    items.appendChild(div);
  });
}

function calculateHeight(value: number, max: number) {
  const percentDiff = value / max;

  if (max < 2) return (percentDiff / 5) * 100;
  else if (max >= 2 && max < 10) return (percentDiff / 6) * 100;
  else return (percentDiff / 1.5) * 100;
}

rangeOptions.querySelectorAll("li").forEach((item) => {
  item.addEventListener("click", (e) => {
    e.stopPropagation();

    if (item.textContent?.toLowerCase() !== range) {
      range = item.textContent?.toLowerCase() as Range;
      rangeOptions.style.display = "none";
      rangeText.textContent = item.textContent;
      createRainfallItems(storedHourlyRainfall, storedDailyRainfall, false);
    }
  });
});

rangeChoice.addEventListener("click", () => {
  rangeOptions.style.display = "block";
});
