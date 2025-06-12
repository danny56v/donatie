import { RequestHandler } from "express";
import { errorHandler } from "../utils/error";
import User from "../models/User";

export const isBlocked: RequestHandler = async (req, res, next) => {
  const userId = req.user?.id;

  if (!userId) {
    return next(errorHandler(401, "Autentificare necesară."));
  }

  const user = await User.findById(userId);

  if (!user) {
    return next(errorHandler(404, "Utilizatorul nu a fost găsit."));
  }

  if (user.isBlocked) {
    return next(errorHandler(403, "Acces interzis. Cont blocat. Contactează administratorul."));
  }

  next();
};
