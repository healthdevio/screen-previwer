import { Page } from "puppeteer";
import { roles } from "../mock/roles";

export class FillLocalStorage {
  public async handle(page: Page, _token: string) {
    await page.evaluateOnNewDocument((token) => {
      localStorage.clear();
      localStorage.setItem("@saude-hd:token", JSON.stringify(`${token}`));
      localStorage.setItem(
        "@saude-hd:contractStatus",
        JSON.stringify("SETTED")
      );
      localStorage.setItem("@saude-hd:roles", JSON.stringify(roles));
    }, _token);
  }
}
