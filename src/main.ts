import express from "express";
import puppeteer, { Browser } from "puppeteer";

let browser: null | Browser;

const app = express();
app.use(express.json());

app.get("/", async (req, res) => {
  const initialTime = new Date().getTime();
  if (browser) {
    const page = await browser.newPage();
    await page.evaluateOnNewDocument((token) => {
      localStorage.clear();
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
    }, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU4MzU4ODZmLTUxYWQtNDE1MS1hZGYyLWIxYTFmODIyMjU1NiIsInVzZXJuYW1lIjoid2lsbGlhbSIsImNvbnRyYWN0X2lkIjoiOGZjNmZhN2UtOGRmOS00NTM2LTlkMmMtMDBkYmY0MDQxZWE1Iiwic2VydmljZV9sb2NhdGlvbl9pZCI6IjFjZTE2YWZmLWZlYmEtNDlkMS05MTM4LWIwNWU3M2Y5ZTgzYyIsImlhdCI6MTY2NzU3OTk4NywiZXhwIjoxNjY3NjA4Nzg3fQ.TuJ_FfHHvfK6lyetxK0pTMzAmj7EoeSwxusolWssn2o");
    await page.goto("http://localhost:5173/apps/pep/home", {
      waitUntil: "networkidle2",
    });
    await page.screenshot({
      path:  "file" + `${Math.random() *  10000000000099}` + ".png",
      clip: { height: 720, width: 1280, x: 0, y: 0 },
    });
    // await browser.close();
    await page.close();
    const finalTime = new Date().getTime();
    return res.json({ ok: true, delay: (finalTime - initialTime) / 1000 });
  }
});

app.listen(3333, () => {
  console.log("Server is running on port 3333");
  puppeteer
    .launch({
      defaultViewport: {
        width: 1280,
        height: 720,
      },
    })
    .then(async (b) => {
      browser = b;
    });
});
