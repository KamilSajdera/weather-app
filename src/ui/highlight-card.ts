import lottie from "lottie-web";

function getCardIcon(target: HTMLDivElement, iconName: string) {
  lottie.loadAnimation({
    container: target,
    renderer: "svg",
    loop: true,
    autoplay: true,
    path: `./animations/${iconName}`,
  });
}

export function createCard(
  name: string,
  data: string,
  iconFile?: string,
  iconWidth?: string
): HTMLDivElement {
  const card = document.createElement("div");
  card.classList.add("current-weather-item");

  const title = document.createElement("h4");
  title.textContent = name;

  const cardIcon = document.createElement("div");
  cardIcon.classList.add("card-icon");

  card.appendChild(title);

  switch (name) {
    case "UV Index": {
      card.appendChild(cardIcon);
      card.appendChild(renderUv(+data));
      break;
    }
    case "Wind Status": {
      const div = document.createElement("div");
      div.classList.add("card-wind");
      div.innerHTML = `${data}<span class="wind-unit">km/h</span>`
      card.appendChild(div);
      card.appendChild(cardIcon);
      
      const marginRemover = document.createElement("div")
      marginRemover.style.marginBottom = "-15px";
      card.appendChild(marginRemover);
      break;
    }
  }

  if (iconFile) getCardIcon(card.querySelector(".card-icon")!, iconFile);

  if (iconWidth) {
    (
      card.querySelector(".card-icon")! as HTMLDivElement
    ).style.width = `${iconWidth}%`;
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
    span.textContent = `${item}`;

    if (item === value) span.classList.add("uv-active");

    if(range.length === 5 && (index === 0 || index === 4))
      span.classList.add("uv-side")

    rootElement.appendChild(span);
  });

  return rootElement;
}
