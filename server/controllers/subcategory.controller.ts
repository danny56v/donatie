import { RequestHandler } from "express";
import { Category } from "../models/Category";
import { errorHandler } from "../utils/error";
import { Subcategory } from "../models/Subcategory";
import mongoose from "mongoose";

export const getSubcategory: RequestHandler = async (req, res, next) => {
  const { categoryId } = req.params;
  try {
    const category = await Category.findById(categoryId).populate("subcategories");
    if (!category) {
      return next(errorHandler(404, "Categoria nu a fost găsită."));
    }

    res.status(200).json(category.subcategories);
  } catch (error) {
    next(errorHandler(500, "Eroare la extragerea subcategoriilor."));
  }
};

export const createSubcategory: RequestHandler = async (req, res, next) => {
  const { categoryId } = req.params;
  const { name } = req.body;

  if (!name) {
    return next(errorHandler(400, "Indicati subcategoria"));
  }

  try {
    const newSubcategory = new Subcategory({ name });
    const savedSubcategory = await newSubcategory.save();

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { $push: { subcategories: savedSubcategory._id } },
      { new: true }
    );

    if (!updatedCategory) {
      await Subcategory.findByIdAndDelete(savedSubcategory._id);
      return next(errorHandler(404, "Categoria nu a fost gasita"));
    }
    res.status(200).json({ category: updatedCategory, subcategory: savedSubcategory });
  } catch (error) {
    next(errorHandler(500, "Eroare la adaugarea subcategoriei."));
  }
};

export const updateSubcategory: RequestHandler = async (req, res, next) => {
  const { categoryId, subcategoryId } = req.params;
  const { name } = req.body;

  if (!name) {
    return next(errorHandler(400, "Indicati subcategoria"));
  }
  if (!mongoose.Types.ObjectId.isValid(categoryId) || !mongoose.Types.ObjectId.isValid(subcategoryId)) {
    return next(errorHandler(400, "ID-ul categoriei sau subcategoriei este invalid"));
  }

  try {
    const subcategoryObjectId = new mongoose.Types.ObjectId(subcategoryId);

    const category = await Category.findById(categoryId);

    if (!category) {
      return next(errorHandler(404, "Categoria nu a fost găsită"));
    }

    if (!category.subcategories.includes(subcategoryObjectId)) {
      return next(errorHandler(404, "Subcategoria nu aparține acestei categorii"));
    }

    const updatedSubcategory = await Subcategory.findByIdAndUpdate(
      subcategoryId,
      { name },
      { new: true, runValidators: true }
    );

    if (!updatedSubcategory) {
      return next(errorHandler(404, "Subcategoria nu a fost gasita."));
    }

    res.status(200).json({ message: "Subcategoria a fost actualizata cu succes", subcategory: updatedSubcategory });
  } catch (error) {
    next(errorHandler(500, "Eroare la actualizarea subcategoriei."));
  }
};

export const deleteSubcategory: RequestHandler = async (req, res, next) => {
  const { categoryId, subcategoryId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(categoryId) || !mongoose.Types.ObjectId.isValid(subcategoryId)) {
    return next(errorHandler(400, "ID-ul categoriei sau subcategoriei este invalid"));
  }

  try {
    const subcategoryObjectId = new mongoose.Types.ObjectId(subcategoryId);
    const category = await Category.findById(categoryId);

    if (!category) {
      return next(errorHandler(400, "Categoria nu a fost gasita."));
    }

    if (!category.subcategories.includes(subcategoryObjectId)) {
      return next(errorHandler(404, "Subcategoria nu apartine aceste categorii"));
    }

    const deletedSubcategory = await Subcategory.findByIdAndDelete(subcategoryId);

    if (!deletedSubcategory) {
      return next(errorHandler(404, "Subcategoria nu a fost gasita"));
    }

    category.subcategories = category.subcategories.filter((subcategory) => !subcategory.equals(subcategoryObjectId));
    await category.save();

    res.status(200).json({ message: "Subcategoria a fost stearsa cu succes" });
  } catch (error) {
    next(errorHandler(500, "Eroare la stergerea subcategoriei. "));
  }
};
