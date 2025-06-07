import lottie from "lottie-web";

function cartIcon(target: HTMLDivElement, iconName: string) {
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

  card.appendChild(title);

  let content: string = "";
  
  switch (name) {
    case "UV Index": {
      content = `<div class='card-icon'></div>`;
    }
  }

  card.innerHTML += content;

  if (iconFile) cartIcon(card.querySelector(".card-icon")!, iconFile);

  if (iconWidth) {
    (
      card.querySelector(".card-icon")! as HTMLDivElement
    ).style.width = `${iconWidth}%`;
  }

  return card;
}