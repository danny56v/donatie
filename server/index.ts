import express, { NextFunction, Request, Response, ErrorRequestHandler } from "express";
import { json } from "body-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRouter from "./routes/auth.route";
import userRouter from "./routes/user.route";
import productRouter from "./routes/product.route";
import categoryRouter from "./routes/category.route";
import adminRouter from "./routes/admin.route";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import passport from "passport";
import session from "express-session";
import "./passport/passport-setup";
dotenv.config();

const app = express();

app.use(helmet());
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
app.use("/api/user", userRouter);
app.use("/api/products", productRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/admin", adminRouter);


app.use(session({
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());
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

app.use(errorHandler);

app.listen(3000, () => {
  console.log("App is listening on port 3000");
});
