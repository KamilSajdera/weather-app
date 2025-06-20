const loaderContainer: HTMLDivElement = document.getElementById("loader")! as HTMLDivElement;

export function startLoader() {
  loaderContainer.style.display = "flex";
}

export function stopLoader() {
  loaderContainer.style.display = "none";  
}
