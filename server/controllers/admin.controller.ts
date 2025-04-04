import e, { RequestHandler } from "express";
import User from "../models/User";
import { errorHandler } from "../utils/error";
import { Product } from "../models/Product";
import { Donation } from "../models/Donation";

export const getAllUsers: RequestHandler = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({ users });
  } catch (error) {
    next(errorHandler(500, "A apărut o eroare la preluarea utilizatorilor."));
  }
};

export const deleteUser: RequestHandler = async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return next(errorHandler(404, "Utilizatorul nu a fost găsit."));
    }

    const deletedUser = await User.findByIdAndDelete(id);

    res.status(200).json({
      message: "Utilizator șters cu succes.",
      deletedUser,
    });
  } catch (error) {
    return next(errorHandler(500, "A apărut o eroare la ștergerea utilizatorului."));
  }
};
export const getAllProducts: RequestHandler = async (req, res, next) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const limitNumber = Number(limit);
    const pageNumber = Number(page);
    const skip = (pageNumber - 1) * limitNumber;
    const products = await Product.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber)
      .populate("owner", "username")
      .populate("category", "name")
      .populate("subcategory", "name")
      .lean();

    const formattedProducts = products.map((product) => ({
      ...product,
      image: product.imageUrls?.[0] || null,
    }));

    // const formattedProducts = products.map((product) => ({
    //   _id: product._id,
    //   name: product.name,
    //   description: product.description,
    //   image: product.imageUrls?.[0] || null,
    //   category: product.category,
    //   subcategory: product.subcategory,
    //   createdAt: product.createdAt,
    //   updatedAt: product.updatedAt,
    //   owner: product.owner,
    //   status: product.status,
    // }));
    const totalProducts = await Product.countDocuments();
    res.status(200).json({
      products: formattedProducts,
      pagination: { page: pageNumber, limit: limitNumber, totalPages: Math.ceil(totalProducts / limitNumber) },
    });
  } catch (error) {
    return next(errorHandler(500, "A apărut o eroare la preluarea produselor."));
  }
};

export const deleteProduct: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.body;
    const deletedProduct = await Product.findByIdAndDelete(id);
    res.status(200).json({ deletedProduct });
  } catch (error) {
    return next(errorHandler(500, "A apărut o eroare la ștergerea produsului."));
  }
};

export const getStatistics: RequestHandler = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalDonations = await Donation.countDocuments();

    res.status(200).json({ totalUsers, totalProducts, totalDonations });
  } catch (error) {
    return next(errorHandler(500, "A apărut o eroare la preluarea statisticilor."));
  }
};
