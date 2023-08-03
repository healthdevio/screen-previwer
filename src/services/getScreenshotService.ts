import { Response } from "express";
import fs from "fs";
import cache from 'memory-cache';
import path from "path";
import { Browser } from "puppeteer";
import { FillLocalStorage } from "../utils/fillLocalStorage";

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

    if (!token) {
      throw new Error("Unauthorized");
    }

    if (!url) {
      throw new Error("URL é obrigatório");
    }

    const cacheKey = `${url}:${newToken}`;
    const cachedValue = cache.get(cacheKey);
    const filepath = path.join(__dirname, "..", "files");
    if (!fs.existsSync(filepath)) {
      fs.mkdirSync(filepath)
    }
    const filename = `file_${Math.round(Math.random() * 10000000000099)}.png`;
    const fileFullPath = path.join(filepath, filename);
    res.setHeader("Content-Type", "image/webp");

    if (!cachedValue) {
      console.log('Cache does not exists');
      page.evaluateOnNewDocument((token) => {
        localStorage.setItem("@saude-hd:token", JSON.stringify(`${token}`));
        localStorage.setItem(
          "@saude-hd:contractStatus",
          JSON.stringify("SETTED")
        );
        localStorage.setItem(
          "@saude-hd:roles",
          JSON.stringify(["ACCESS_PEP",
            "ACCESS_PANNEL",
            "ACCESS_FINNANCE",
            "CAN_SHOW_NOTIFICATIONS",
            "CAN_SHOW_HELP",
            "ACCESS_SETTINGS",
            "ACCESS_TOTEM",
            "ACCESS_PARAMS",
            "ACCESS_PROFILE",
            "ACCESS_REPORTS",
            "CONTROL_WHATSAPP_BOT",
            "SHOW_AUDIO_TRANSCRIPTION",
            "ACCESS_RECEPTION",
            "ACCESS_TELEMEDICINE_MODULE",
            "ACCESS_BENEFIT_CARD_MODULE"])
        );
      }, newToken);
      const openFinalTime = new Date().getTime();
      const openTime = ((openFinalTime - openInitialTime) / 1000).toFixed(2);
      console.log("Page is Rendered in " + openTime);
      const multiplier = scale ? scale : 1;

      await page.goto(url, { waitUntil: "networkidle2" });

      const screenshotInitialTime = new Date().getTime();
      console.log("Initializing screenshot page browser");
      await page.screenshot({
        path: fileFullPath,
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

      const file = fs.readFileSync(fileFullPath);

      cache.put(cacheKey, file, 1000 * 60 * 2);

      const stream = fs.createReadStream(fileFullPath);
      stream.pipe(res);
    } else {
      fs.writeFileSync(fileFullPath, cachedValue);
      const stream = fs.createReadStream(fileFullPath);
      stream.pipe(res);
    }


    setTimeout(() => {
      fs.unlinkSync(fileFullPath);
      page.close();
    }, 4500);
  }
}
