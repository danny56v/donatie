import { RequestHandler } from "express";
import { Product } from "../models/Product";
import { errorHandler } from "../utils/error";

export const createProduct: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      res.status(401).send("Unauthorized: No user ID found.");
      return;
    }
    const { name, description, condition, category, subcategory } = req.body;
    // console.log(req.body)
    if (!name || !description || !condition || !category || !subcategory) {
      next(errorHandler(400, "Introduceti datele in toate campurile"));
    }
    // console.log(req.user.id);
    const newProduct = new Product({
      name,
      description,
      condition,
      category,
      subcategory,
      userId: req.user.id,
    });
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    // console.log(error)
    return next(errorHandler(400, "A apărut o eroare la postarea produsului."));
  }
};


