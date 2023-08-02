import { Request, Response } from "express";
import puppeteer, { Browser } from "puppeteer";
import { GetScreenshotService } from "../services/getScreenshotService";

export class GetScreenshotController {
  private browser: Browser | null;

  constructor(private readonly getScreenshotService: GetScreenshotService) {
    this.handle.bind(this);
    this.browser = null;
    puppeteer
      .launch({
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--disable-gpu',
        ],
        headless: 'new',
        waitForInitialPage: false,
      })
      .then(async (browser) => {
        console.log("Pupperteer browser initialized");
        this.browser = browser;
      });
  }
  handle = async (req: Request, res: Response) => { //Não altere de arrow fucntion para named function
    try {
      const { scale } = req.query;
      const multiplier = scale ? Number(scale) : 1;
      if (!this.browser) {
        return res
          .status(400)
          .json({ error: true, message: "Browser is not initialized" });
      }

      await this.getScreenshotService.handle(
        this.browser as Browser,
        (req.headers["authorization"] as string) ||
          (req.query["token"] as string),
        req.query["url"] as string,
        res,
        multiplier
      );
    } catch (error: any) {
      return res
        .status(400)
        .json({ error: true, message: error.message, stack: error.stack });
    }
  }
}
