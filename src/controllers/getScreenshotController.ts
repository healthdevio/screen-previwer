import { Request, Response } from "express";
import puppeteer, { Browser } from "puppeteer";
import { GetScreenshotService } from "../services/getScreenshotService";

export class GetScreenshotController {
  private browser: Browser | null;

  constructor(private readonly getScreenshotService: GetScreenshotService) {
    const minimal_args = [
      '--autoplay-policy=user-gesture-required',
      '--disable-background-networking',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-breakpad',
      '--disable-client-side-phishing-detection',
      '--disable-component-update',
      '--disable-default-apps',
      '--disable-dev-shm-usage',
      '--disable-domain-reliability',
      '--disable-extensions',
      '--disable-features=AudioServiceOutOfProcess',
      '--disable-hang-monitor',
      '--disable-ipc-flooding-protection',
      '--disable-notifications',
      '--disable-offer-store-unmasked-wallet-cards',
      '--disable-popup-blocking',
      '--disable-print-preview',
      '--disable-prompt-on-repost',
      '--disable-renderer-backgrounding',
      '--disable-setuid-sandbox',
      '--disable-speech-api',
      '--disable-sync',
      '--hide-scrollbars',
      '--ignore-gpu-blacklist',
      '--metrics-recording-only',
      '--mute-audio',
      '--no-default-browser-check',
      '--no-first-run',
      '--no-pings',
      '--no-sandbox',
      '--no-zygote',
      '--password-store=basic',
      '--use-gl=swiftshader',
      '--use-mock-keychain',
    ];
    this.handle.bind(this);
    this.browser = null;
    puppeteer
      .launch({
        args: minimal_args,
        headless: 'new',
        waitForInitialPage: false,
        defaultViewport: {
          width: 1280,
          height: 720,
        },
        userDataDir: './.cache/path'

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
