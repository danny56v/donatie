import { RequestHandler } from "express";

import User from "../models/User";
import bcrypt from "bcrypt";

interface SignUpRequestBody {
  username: string;
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
    const errorMessage = error instanceof Error ? error.message : "An error occured";
    res.status(500).json({ message: errorMessage });
  }
};
