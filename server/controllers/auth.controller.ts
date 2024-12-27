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
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !password || !username) {
    return next(errorHandler(400, "Toate câmpurile sunt obligatorii."));
  }
  if (!emailRegex.test(email)) {
    return next(errorHandler(400, "Email invalid. Te rugăm să introduci un email corect."));
  }

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return next(errorHandler(400, "Email sau username existent!"));
      // res.status(400).json({ message: "Email sau username deja utilizat." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, username, password: hashedPassword });
    await newUser.save();

    // console.log(newUser);
    res.status(201).json({ message: "User, created succesfully" });
  } catch (error) {
    // const errorMessage = error instanceof Error ? error.message : "An error occured";
    // res.status(500).json({ message: errorMessage });
    return next(errorHandler(500, "A apărut o eroare la crearea utilizatorului."));
  }
};

export const signin: RequestHandler<{}, {}, SignInRequestBody> = async (req, res, next) => {
  const { email, password } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !password) {
    return next(errorHandler(400, "Email-ul și parola sunt obligatorii."));
  }

  if (!emailRegex.test(email)) {
    return next(errorHandler(400, "Email invalid. Te rugăm să introduci un email corect."));
  }
  try {
    const validUser = (await User.findOne({ email })) as IUser;
    if (!validUser) return next(errorHandler(401, "Email sau Parolă greșită"));
    if (validUser.googleId) {
      return next(errorHandler(401, "Te rog să te conectezi folosind Google."));
    }
    if (!validUser.password) {
      return next(errorHandler(404, "Email sau Parolă greșită"));
    }

    const validPassword = await bcrypt.compare(password, validUser.password);
    if (!validPassword) return next(errorHandler(404, "Email sau Parolă greșită"));
    const token = jwt.sign({ id: validUser._id, isAdmin: validUser.isAdmin }, process.env.JWT_SECRET as string);
    const { password: hashedPassword, ...rest } = validUser;
    const expiryDate = new Date(Date.now() + 3600000);
    res.cookie("access_token", token, { httpOnly: true, secure: true, expires: expiryDate }).status(200).json(rest);
  } catch (error) {
    return next(errorHandler(500, "Eroare logare!"));
  }
};

// Funcția pentru signout
export const signout: RequestHandler = (req, res) => {
  res.cookie("access_token", "", {
    httpOnly: true,
    secure: true, // Asigură-te că aplicația rulează pe HTTPS
    sameSite: "strict", // Limitează accesul din contexte de la terți
    expires: new Date(0), // Expiră imediat cookie-ul pentru sign-out
  });
  res.status(200).json({ message: "Sign out successful" });
};
