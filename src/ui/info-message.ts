const infoFrame: HTMLDivElement = document.getElementById(
  "info-frame"
)! as HTMLDivElement;

let timeoutId: ReturnType<typeof setTimeout>;

export function printInfo(
  type: "success" | "fail",
  message: string,
  duration: number = 5000
) {
  infoFrame.textContent = message;
  infoFrame.style.display = "block";

  clearTimeout(timeoutId);

  timeoutId = setTimeout(() => {
    infoFrame.style.display = "none";
  }, duration);

  infoFrame.style.background = type === "fail" ? "#c93333" : "#3ea214";
}
