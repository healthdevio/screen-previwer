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
        args: [ '--disable-gpu', '--disable-setuid-sandbox', '--no-sandbox', '--no-zygote' ],
        defaultViewport: {
          width: 1280,
          height: 720,
        },
      })
      .then(async (browser) => {
        console.log("Pupperteer browser initialized");
        this.browser = browser;
      });
  }
  handle = async (req: Request, res: Response) => { //Não altere de arrow fucntion para named function
    try {
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
        res
      );
    } catch (error: any) {
      return res
        .status(400)
        .json({ error: true, message: error.message, stack: error.stack });
    }
  }
}
