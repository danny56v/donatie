import { RequestHandler } from "express";
import { errorHandler } from "../utils/error";

export const isAdmin: RequestHandler = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return next(errorHandler(403, "Acces restricționat - necesită drepturi de administrator!"));
  }
  next();
};
