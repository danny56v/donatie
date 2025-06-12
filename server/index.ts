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
import { createServer } from "http";
import { Server } from "socket.io";
import { Message } from "./models/Message";
import { Conversation } from "./models/Conversation";
dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server);

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


io.on('connection', client => {
  client.on('event', data => { /* … */ });
  client.on('disconnect', () => { /* … */ });
});


io.on('connection', (socket) => {
  console.log('Un utilizator s-a conectat.', socket.id);

  socket.on('new_message', (data) => {
    const newMessage = new Message(data);
    newMessage.save().then((savedMessage) => {
      Conversation.findOneAndUpdate(
        { participants: { $all: [data.senderId, data.receiverId] } },
        { $push: { messages: savedMessage._id } },
        { new: true, upsert: true }
      ).then(() => {
        io.emit('message_received', data);
      });
    });
  });

  socket.on('disconnect', () => {
    console.log('Un utilizator s-a deconectat.');
  });
});


app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/products", productRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/admin", adminRouter);

app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
  })
);

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
