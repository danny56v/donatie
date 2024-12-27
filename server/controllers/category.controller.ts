import { RequestHandler } from "express";
import { Category } from "../models/Category";
import { errorHandler } from "../utils/error";

export const addCategory: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id || !req.user.isAdmin) {
      return next(errorHandler(401, "Acces restricționat - necesită drepturi de administrator!"));
    }
    const { name } = req.body;

    if (!name) {
      return next(errorHandler(400, "Numele categoriei este obligatoriu"));
    }

    const newCategory = new Category({ name });
    const savedCategory = await newCategory.save();
    // console.log(savedCategory);
    res.status(201).json(savedCategory);
  } catch (error) {
    return next(errorHandler(500, "Eroare la adaugarea categoriei"));
  }
};

export const changeCategoryName: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id || !req.user.isAdmin) {
      return next(errorHandler(401, "Acces restricționat - necesită drepturi de administrator!"));
    }
    const { oldName, newName } = req.body;
    if (!oldName || !newName) {
      return next(errorHandler(400, "Campurile sunt obligatorii!"));
    }
    const category = await Category.findOneAndUpdate(
      { name: oldName },
      { name: newName },
      { new: true, runValidators: true }
    );
    if (!category) {
      return next(errorHandler(404, "Categoria nu a fost găsită."));
    }
    // console.log(category);
    res.status(200).json({ message: "Categoria a fost actualizată cu succes.", category });
  } catch (error) {
    // console.error(error);
    next(errorHandler(400, "Eroare la actualizarea categoriei."));
  }
};

export const deleteCategory: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id || !req.user.isAdmin) {
      return next(errorHandler(401, "Acces restricționat - necesită drepturi de administrator!"));
    }
    const { name } = req.body;

    const deletedCategory = await Category.findOneAndDelete({ name });

    if (!deletedCategory) {
      return next(errorHandler(401, "Categoria nu a fost găsită și nu a putut fi ștearsă."));
    }

    res.status(200).send("Categoria a fost ștearsă cu succes.");
  } catch (error) {
    next(errorHandler(400, "Eroare la stergerea categoriei."));
  }
};
