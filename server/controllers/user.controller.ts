import { RequestHandler } from "express";
import User from "../models/User";
import { errorHandler } from "../utils/error";

export const getUser: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id)
    // .populate({
    //   path: "productsId",
    //   populate: [
    //     { path: "category", model: "Category" },
    //     { path: "subcategory", model: "Subcategory" },
    //   ],
    // })
    .select("-password -__v");    if (!user) {
      next(errorHandler(404, "Utilizatorul nu a fost găsit."));
    }
    res.status(200).json({ user });
  } catch (error) {
    next(errorHandler(500, "A apărut o eroare la preluarea utilizatorului."));
  }
};
