import express from "express";
import { Routes } from "./routes";

const app = express();
app.use(express.json());
app.use(Routes);

app.listen(80, () => {
  console.log("Server is running on port 80");
});
