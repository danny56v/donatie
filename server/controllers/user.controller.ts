import { RequestHandler } from "express";
import User from "../models/User";
import { errorHandler } from "../utils/error";

export const getUserCount: RequestHandler = async (req, res, next) => {
  try {
    const userCount = await User.countDocuments();
    res.status(200).json({ userCount });
  } catch (error) {
    next(errorHandler(500, "A apărut o eroare la preluarea numărului de utilizatori."));
  }
};

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
      .select("-password -__v");
    if (!user) {
      next(errorHandler(404, "Utilizatorul nu a fost găsit."));
    }
    res.status(200).json({ user });
  } catch (error) {
    next(errorHandler(500, "A apărut o eroare la preluarea utilizatorului."));
  }
};

export const blockUser: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return next(errorHandler(404, "Utilizatorul nu a fost găsit."));
    }
    if (user.isBlocked) {
      return next(errorHandler(400, "Utilizatorul este deja blocat."));
    }
    user.isBlocked = true;
    await user.save();
    res.status(200).json({ message: "Utilizatorul a fost blocat cu succes." });
  } catch (error) {
    next(errorHandler(500, "A apărut o eroare la blocarea utilizatorului."));
  }
};

export const blockUserFor30Days: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const blockDuration = 30;

    const user = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
        blockedUntil: new Date(Date.now() + blockDuration * 24 * 60 * 60 * 1000),
      },
      { new: true }
    );

    if (!user) {
      res.status(404).json({ message: "Utilizatorul nu a fost găsit" });
    }

    res.status(200).json({ message: `Utilizator blocat pentru ${blockDuration} zile`, user });
  } catch (error) {
    next(errorHandler(500, "A apărut o eroare la blocarea utilizatorului."));
  }
};

export const unblockUser: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return next(errorHandler(404, "Utilizatorul nu a fost găsit."));
    }
    if (!user.isBlocked) {
      return next(errorHandler(400, "Utilizatorul nu este blocat."));
    }
    user.isBlocked = false;
    user.blockedUntil = null;
    await user.save();
    res.status(200).json({ message: "Utilizatorul a fost deblocat cu succes." });
  } catch (error) {
    next(errorHandler(500, "A apărut o eroare la deblocarea utilizatorului."));
  }
};
