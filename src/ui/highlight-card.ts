import lottie from "lottie-web";
import type { HighlightCard } from "../types/main";

function getCardIcon(target: HTMLDivElement, iconName: string) {
  lottie.loadAnimation({
    container: target,
    renderer: "svg",
    loop: true,
    autoplay: true,
    path: `./animations/${iconName}`,
  });
}

export function createCard({ name, data, iconFile, iconSize}: HighlightCard): HTMLDivElement {
  const card = document.createElement("div");
  card.classList.add("current-weather-item");

  const title = document.createElement("h4");
  title.textContent = name;

  const cardIcon = document.createElement("div");
  cardIcon.classList.add("card-icon");

  card.appendChild(title);

  const div = document.createElement("div");

  switch (name) {
    case "UV Index": {
      card.appendChild(cardIcon);
      card.appendChild(renderUv(+data));
      break;
    }
    case "Wind Status": {
      div.classList.add("card-wind");
      div.innerHTML = `${data}<span class="wind-unit">km/h</span>`;
      card.appendChild(div);
      card.appendChild(cardIcon);

      const marginRemover = document.createElement("div");
      marginRemover.style.marginBottom = "-15px";
      card.appendChild(marginRemover);
      break;
    }
    case "Sunrise & Sunset": {
      card.appendChild(cardIcon);

      const formattedSunrise = new Date(data.sunrise).toLocaleTimeString("pl-PL", {
        hourCycle: "h24",
        hour: "2-digit",
        minute: "2-digit"
      });

      const formattedSunset = new Date(data.sunset).toLocaleTimeString("pl-PL", {
        hourCycle: "h24",
        hour: "2-digit",
        minute: "2-digit"
      });

      div.classList.add("sun-cycle");
      div.innerHTML = `<div>${formattedSunrise}</div><div>${formattedSunset}</div>`;
      card.appendChild(div);
      break;
    }
    case "Humidity": {
      card.appendChild(cardIcon);

      div.innerHTML = `<h4 class="humidity">${data}%</h4>`;
      card.appendChild(div);
      break;
    }
    case "Atmospheric pressure": {
      cardIcon.style.marginTop = "25px";
      cardIcon.style.marginBottom = "25px";
      card.appendChild(cardIcon);

      div.innerHTML = `<h4 class="humidity">${data}<span class="wind-unit">hPa</span></h4>`;
      card.appendChild(div);
      break;
    }
  }

  if (iconFile) getCardIcon(card.querySelector(".card-icon")!, iconFile);

  if (iconSize) {
    (
      card.querySelector(".card-icon")! as HTMLDivElement
    ).style.width = `${iconSize}%`;
  }

  return card;
}

function getUvRange(value: number): number[] {
  if (value === 0 || value >= 11) return [value];
  if (value === 1) return [0, 1, 2];
  if (value === 10) return [9, 10, 11];

  let range: number[] = [];

  const min = Math.max(value - 2, 0);
  const max = Math.min(value + 2, 11);

  for (let i = min; i <= max; i++) {
    range.push(i);
  }

  return range;
}

function renderUv(value: number) {
  const range = getUvRange(value);

  const rootElement = document.createElement("div");
  rootElement.classList.add("uv");

  range.forEach((item, index) => {
    let span = document.createElement("span");
    span.classList.add("uv-item");
    span.textContent = `${+item.toFixed(0)}`;

    if (item === value) span.classList.add("uv-active");

    if (range.length === 5 && (index === 0 || index === 4))
      span.classList.add("uv-side");

    rootElement.appendChild(span);
  });

  return rootElement;
}
