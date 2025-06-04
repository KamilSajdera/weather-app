import type { CitiesApi } from "../types/sidebar";

let currentAbortController: AbortController | null = null;
let activeRequests: number = 0;

export async function fetchCities(
  inputValue: string,
  loaderElement: HTMLDivElement
): Promise<CitiesApi | undefined> {
  if (currentAbortController) {
    currentAbortController.abort();
  }

  const controller = new AbortController();
  currentAbortController = controller;

  const signal = controller.signal;

  activeRequests++;
  try {
    if (signal.aborted) {
      return;
    }

    const userCities = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${inputValue}&key=1304a941dc074690a858f246327825e4&language=en`,
      { signal }
    );

    const data: CitiesApi = await userCities.json();
    return data;
  } catch (error) {
    if ((error as Error).name === "AbortError") {
      return;
    }
    console.error("~ Fetching cities error ~", error);
  } finally {
    activeRequests--;
    if (activeRequests <= 0) loaderElement.style.display = "none";
  }
}
