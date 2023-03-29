import { Response } from "express";
import { Browser, Page } from "puppeteer";
import path from "path";
import { FillLocalStorage } from "../utils/fillLocalStorage";
import fs from "fs";

export class GetScreenshotService {
  fillLocalStorageService: FillLocalStorage;
  constructor() {
    this.fillLocalStorageService = new FillLocalStorage();
  }

  public async handle(
    browser: Browser,
    token: string,
    url: string,
    res: Response,
    scale?: number
  ) {
    const openInitialTime = new Date().getTime();
    const page = await browser.newPage();
    const newToken = token.replace("Bearer ", "");
    page.evaluateOnNewDocument((token) => {
      localStorage.setItem("@saude-hd:token", JSON.stringify(`${token}`));
      localStorage.setItem(
        "@saude-hd:contractStatus",
        JSON.stringify("SETTED")
      );
      localStorage.setItem(
        "@saude-hd:roles",
        JSON.stringify([
          "ACCESS_PEP",
          "ACCESS_RECEPTION",
          "CAN_SHOW_NOTIFICATIONS",
          "ACCESS_SETTINGS",
          "CAN_SHOW_HELP",
          "ACCESS_PANNEL",
          "ACCESS_FINNANCE",
          "ACCESS_TOTEM",
          "ACCESS_PARAMS",
        ])
      );
    }, newToken);
    const openFinalTime = new Date().getTime();
    const openTime = ((openFinalTime - openInitialTime) / 1000).toFixed(2);
    console.log("Page is Rendered in " + openTime);
    const multiplier = scale ? scale : 1;
    if (!token) {
      throw new Error("Unauthorized");
    }

    if (!url) {
      throw new Error("URL é obrigatório");
    }

    
    await page.goto(url, { waitUntil: "networkidle2" });


    const filepath = path.resolve(__dirname, "..", "files");
    const filename = `file_${Math.round(Math.random() * 10000000000099)}.png`;
    const screenshotInitialTime = new Date().getTime();
    console.log("Initializing screenshot page browser");
    await page.screenshot({
      path: path.join(filepath, filename),
      clip: { height: 720, width: 1280, x: 0, y: 0 },
      quality: 100 * multiplier,
      type: "webp",
    });
    const screenshotFinalTime = new Date().getTime();
    const screenshotTime = (
      (screenshotFinalTime - screenshotInitialTime) /
      1000
    ).toFixed(2);
    console.log("Screenshot taked in " + screenshotTime);
    console.log("The stream total time: " + screenshotTime + openTime);

    res.setHeader("Content-Type", "image/webp");
    const stream = fs.createReadStream(path.join(filepath, filename));
    stream.pipe(res);

    setTimeout(() => {
      fs.unlinkSync(path.join(filepath, filename));
      page.close();
    }, 4500);
  }
}
