import express, { NextFunction, Request, Response } from "express";
import { json } from "body-parser";

import dotenv from "dotenv";
import mongoose from "mongoose";

import authRouter from "./routes/auth.route";

dotenv.config();

const app = express();

app.use(json());

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("DATABASE CONNECTED");
}

app.use("/api/auth", authRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ message: err.message });
});

app.listen(3000, () => {
  console.log("App is listening on port 3000");
});
