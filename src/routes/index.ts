import express from 'express';
import { GetScreenshotController } from '../controllers/getScreenshotController';
import { GetScreenshotService } from '../services/getScreenshotService';

export const Routes = express.Router();
const screenshotController = new GetScreenshotController(
  new GetScreenshotService()
);

Routes.get("/screenshot", screenshotController.handle);