import "./theme/theme-controller.js";
import "./theme/preferences-dialog.js";
import { bootstrapApplication } from "./app/bootstrap.js";

try {
  bootstrapApplication();
} catch (error) {
  document.querySelector("[data-boot-surface]")?.setAttribute("data-boot-error", "true");
  console.error("O SIVI não pôde ser inicializado.", error);
}
