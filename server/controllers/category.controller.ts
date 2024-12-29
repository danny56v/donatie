import { RequestHandler } from "express";
import { Category } from "../models/Category";
import { errorHandler } from "../utils/error";
import { Subcategory } from "../models/Subcategory";

export const getCategories: RequestHandler = async (req, res, next) => {
  try {
    const categories = await Category.find().populate("subcategories");
    res.status(200).json(categories);
  } catch (error) {
    return next(errorHandler(500, "Eroare la găsirea categoriilor"));
  }
};

export const createCategory: RequestHandler = async (req, res, next) => {
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

export const updateCategory: RequestHandler = async (req, res, next) => {
  const categoryId = req.params.categoryId;
  try {
    if (!req.user || !req.user.id || !req.user.isAdmin) {
      return next(errorHandler(401, "Acces restricționat - necesită drepturi de administrator!"));
    }
    const { name } = req.body;
    if (!name) {
      return next(errorHandler(400, "Campurile sunt obligatorii!"));
    }
    const category = await Category.findByIdAndUpdate(categoryId, { name }, { new: true, runValidators: true });
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
  const categoryId = req.params.categoryId;
  try {
    if (!req.user || !req.user.id || !req.user.isAdmin) {
      return next(errorHandler(401, "Acces restricționat - necesită drepturi de administrator!"));
    }

    const category = await Category.findById(categoryId);

    if (!category) {
      return next(errorHandler(404, "Categoria nu a fost gasită și nu a putut fi ștearsă."));
    }

    if (category.subcategories && category.subcategories.length > 0) {
      await Subcategory.deleteMany({ _id: { $in: category.subcategories } });
    }

    await Category.deleteOne({ _id: categoryId });

    res.status(200).send("Categoria și subcategoriile sale au fost ștearse cu succes.");
  } catch (error) {
    next(errorHandler(400, "Eroare la stergerea categoriei."));
  }
};
