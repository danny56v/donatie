import jwt from "jsonwebtoken";
import { RequestHandler } from "express";


export const verifyToken: RequestHandler = async (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    req.isAuthenticated = false;
    return next();
    // res.sendStatus(401);
    // return; 
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded;
    req.isAuthenticated = true;
    // console.log(req.user)
    next();
  } catch (err) {
    req.isAuthenticated = false;
    next(err);
  }
};
