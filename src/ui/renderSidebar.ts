import { type SidebarData } from "../types/sidebar";

export class SidebarInput {
  private readonly templateMain: HTMLTemplateElement;
  private readonly templateFooter: HTMLTemplateElement;
  private readonly target: HTMLDivElement;

  private contentMain!: HTMLDivElement;
  private contentFooter!: HTMLDivElement;

  private months: string[] = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  private weekdays:string[] = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

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

    img.src = imageSrc;
    img.alt = imageAlt;
    degreesBox.textContent = `${degrees}°C`;
    cityBox.textContent = city;
    dayBox.innerHTML = `${
      this.weekdays[todayDate.getDay()]
    } <span class="sidebar_date">${todayDate.getDate()} ${
      this.months[todayDate.getMonth()]
    }</span>`;
  }

  private renderFooterContent(): void {
    const descBox = this.contentFooter.querySelector("#footer-desc")!;
    const chanceBox = this.contentFooter.querySelector("#footer-chance")!;

    descBox.innerHTML = `<i class="fa-solid fa-cloud-rain"></i> ${this.data.description}`;
    chanceBox.innerHTML = `<i class="fa-solid fa-chart-pie"></i> ${this.data.chanceOfRain}%`;

    const nearestHourlyTemp:number[] = this.data.hourly_temp.slice(0,48);

    const currentTime:number = new Date().getHours();

    const ul = document.createElement("ul");
    ul.classList.add("temp-list")

    for(let i = 0; i<=12; i++)
    {
        const li = document.createElement("li");
        li.classList.add("temp-item")

        if(currentTime+i<=24)
            li.innerHTML = `<div class="hourly-time">${currentTime+i}:00</div><div class="hourly-temp">${nearestHourlyTemp[currentTime+i]}°C</div>`
        else 
           li.innerHTML = `<div class="hourly-time">${(currentTime+i)-24}:00</div><div class="hourly-temp">${nearestHourlyTemp[currentTime+i]}°C</div>`  
        
        ul.appendChild(li)
    }

    this.contentFooter.appendChild(ul)
  }

  private attach(): void {
    const fragment = document.createDocumentFragment();
    fragment.appendChild(this.contentMain);
    fragment.appendChild(this.contentFooter);
    this.target.appendChild(fragment);
  }
}
