import { type SidebarData } from "../types/sidebar";

export class SidebarInput {
  private readonly templateMain: HTMLTemplateElement;
  private readonly templateFooter: HTMLTemplateElement;
  private readonly target: HTMLDivElement;

  private contentMain!: HTMLDivElement;
  private contentFooter!: HTMLDivElement;

  constructor(private readonly data: SidebarData) {
    this.templateMain = document.getElementById(
      "t-sidebar-main"
    ) as HTMLTemplateElement;
    this.templateFooter = document.getElementById(
      "t-sidebar-footer"
    ) as HTMLTemplateElement;

    this.target = document.querySelector(
      ".sidebar-city-info"
    ) as HTMLDivElement;

    this.prepareTemplates();
    this.renderMainContent();
    this.renderFooterContent();
    this.attach();
  }

  private prepareTemplates(): void {
    const importedMain = document.importNode(this.templateMain.content, true);
    const importedFooter = document.importNode(
      this.templateFooter.content,
      true
    );

    this.contentMain = importedMain.firstElementChild as HTMLDivElement;
    this.contentFooter = importedFooter.firstElementChild as HTMLDivElement;
  }

  private renderMainContent(): void {
    const {
      city,
      degrees,
      imageSrc = "./assets/sun.png",
      imageAlt = "Weather Icon",
    } = this.data;

    const img = this.contentMain.querySelector("img")!;
    const degreesBox = this.contentMain.querySelector(".sidebar-degrees")!;
    const cityBox = this.contentMain.querySelector(".sidebar_city")!;
    const dayBox = this.contentMain.querySelector(".sidebar_day")!;

    const todayDate: Date = new Date();
    const todayWeekday: string = todayDate.toLocaleDateString("en-US", {
      weekday: "long",
    });
    const currentMonth: string = todayDate.toLocaleDateString("en-US", {
      month: "long",
    });

    img.src = imageSrc;
    img.alt = imageAlt;
    degreesBox.textContent = `${degrees}°C`;
    cityBox.textContent = city;
    dayBox.innerHTML = `${todayWeekday} <span class="sidebar_date">${todayDate.getDate()} ${currentMonth}</span>`;
  }

  private renderFooterContent(): void {
    const descBox = this.contentFooter.querySelector("#footer-desc")!;
    const chanceBox = this.contentFooter.querySelector("#footer-chance")!;

    descBox.innerHTML = `<i class="fa-solid fa-cloud-rain"></i> ${this.data.description}`;
    chanceBox.innerHTML = `<i class="fa-solid fa-chart-pie"></i> ${this.data.chanceOfRain}%`;

    const nearestHourlyTemp: number[] = this.data.hourly_temp.slice(0, 48);

    const currentTime: number = new Date().getHours();

    const hourlyTempContainer = document.createElement("div");
    hourlyTempContainer.classList.add("next-hours-temp");

    for (let i = 0; i <= 12; i++) {
      const div = document.createElement("div");
      div.classList.add("hourly-item");

      if (currentTime + i <= 24)
        div.innerHTML = `<div class="hourly-hour">${
          currentTime + i
        }:00</div><div class="hourly-timeline"><span class="timeline-line"></span></div><div class="hourly-temp">${
          nearestHourlyTemp[currentTime + i]
        }°C</div>`;
      else
        div.innerHTML = `<div class="hourly-hour">${
          currentTime + i - 24
        }:00</div><div class="hourly-timeline"><span class="timeline-line"></span></div><div class="hourly-temp">${
          nearestHourlyTemp[currentTime + i]
        }°C</div>`;

      hourlyTempContainer.appendChild(div);
    }

    this.contentFooter.appendChild(hourlyTempContainer);
  }

  private attach(): void {
    const fragment = document.createDocumentFragment();
    fragment.appendChild(this.contentMain);
    fragment.appendChild(this.contentFooter);
    this.target.appendChild(fragment);
  }

  public createTempsAxis(): void {
    const items = document.querySelectorAll(".hourly-item");

    items.forEach((el) => el.classList.remove("last-in-row"));

    items.forEach((item, i) => {
      const timelineLine: HTMLDivElement =
        item.querySelector(".timeline-line")!;

      const nextItem = items[i + 1] as HTMLElement | undefined;
      const thisTop = (item as HTMLElement).offsetTop;
      const thisPosX = (item as HTMLElement).offsetLeft;
      const nextTop = nextItem?.offsetTop;
      const nextPosX = nextItem?.offsetLeft;

      let tempAxisWidth: number = 0;

      if (nextPosX) tempAxisWidth = nextPosX - thisPosX;

      if (timelineLine) {
        timelineLine.style.width = `${tempAxisWidth - 8}px`;
      }

      if (nextTop !== undefined && thisTop !== nextTop) {
        item.classList.add("last-in-row");
      }

      if (i === items.length - 1) {
        item.classList.add("last-in-row");
      }
    });
  }
}
