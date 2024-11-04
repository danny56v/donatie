import express, { NextFunction, Request, Response, ErrorRequestHandler } from "express";
import { json } from "body-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRouter from "./routes/auth.route";
import cookieParser from "cookie-parser";
import helmet from "helmet";

dotenv.config();

const app = express();

app.use(helmet())
app.use(json());



app.use(cookieParser());

async function main() {
  try {
    await mongoose.connect(process.env.MONGO_URL as string);
    console.log("DATABASE CONNECTED");
  } catch (err) {
    console.error("Database connection error:", err);
  }
}

main();

app.use("/api/auth", authRouter);

interface ErrorWithStatusCode extends Error {
  statusCode?: number;
}

const errorHandler: ErrorRequestHandler = (
  err: ErrorWithStatusCode,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
};

// Attach the error handler middleware after routes
app.use(errorHandler);

app.listen(3000, () => {
  console.log("App is listening on port 3000");
});
