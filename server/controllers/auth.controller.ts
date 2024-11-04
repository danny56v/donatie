import { RequestHandler } from "express";

import bcrypt from "bcrypt";
import { errorHandler } from "../utils/error";
import User from "../models/User";
import jwt from "jsonwebtoken";

import { IUser } from "../models/User";

interface SignUpRequestBody {
  username: string;
  email: string;
  password: string;
}
interface SignInRequestBody {
  email: string;
  password: string;
}

export const signup: RequestHandler<{}, {}, SignUpRequestBody> = async (req, res, next) => {
  const { email, username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, username, password: hashedPassword });
    await newUser.save();

    console.log(newUser);
    res.status(201).json({ message: "User, created succesfully" });
  } catch (error) {
    // const errorMessage = error instanceof Error ? error.message : "An error occured";
    // res.status(500).json({ message: errorMessage });
    return next(error);
  }
};

export const signin: RequestHandler<{}, {}, SignInRequestBody> = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = (await User.findOne({ email })) as IUser;
    if (!validUser) return next(errorHandler(401, "User not found"));
    if (validUser.googleId) {
      return next(errorHandler(401, "Te rog să te conectezi folosind Google."));
    }
    if (!validUser.password) {
      return next(errorHandler(404, "Parola nu este definită."));
    }

    const validPassword = await bcrypt.compare(password, validUser.password);
    if (!validPassword) return next(errorHandler(404, "Invalid Credentials"));
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET as string);
    const { password: hashedPassword, ...rest } = validUser;
    const expiryDate = new Date(Date.now() + 3600000);
    res.cookie("access_token", token, { httpOnly: true, expires: expiryDate }).status(200).json(rest);
  } catch (error) {
    return next(error);
  }
}
