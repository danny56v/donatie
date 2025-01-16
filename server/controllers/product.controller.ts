import { RequestHandler } from "express";
import { Product } from "../models/Product";
import { errorHandler } from "../utils/error";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../utils/s3Config";
import sharp from "sharp";

export const getAllProducts: RequestHandler = async (req, res, next) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    return next(errorHandler(400, "A apărut o eroare la preluarea produselor."));
  }
};

export const getProductById: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id)
      .populate("userId", "username")
      .populate("category")
      .populate("subcategory");
    if (!product) {
      return next(errorHandler(404, "Produsul nu a fost gasit."));
    }
    res.status(200).json(product);
  } catch (error) {
    return next(errorHandler(400, "A apărut o eroare la preluarea produsului."));
  }
};

export const createProduct: RequestHandler = async (req, res, next) => {
  // console.log(req.files);
  try {
    const files = req.files as Express.Multer.File[];

    if (!files) {
      return next(errorHandler(400, "Nici o imagine nu a fost trimitsa"));
    }
    if (!req.user || !req.user.id) {
      return next(errorHandler(401, "Unauthorized: No user ID found."));
    }
    const { name, description, condition, category, subcategory } = req.body;
    // console.log(req.body)
    if (!name || !description || !condition || !category || !subcategory) {
      return next(errorHandler(400, "Introduceti datele in toate campurile"));
    }
    const imageUrls: string[] = [];

    for (const file of files) {
      const resizedImageBuffer = await sharp(file.buffer).resize({ width: 1980 , height: 1200, fit:'inside'}).toBuffer();
      const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: `${Date.now()}-${file.originalname}`,
        Body: resizedImageBuffer,
        ContentType: file.mimetype,
        // ACL: "public-read" as ObjectCannedACL,
      };

      const command = new PutObjectCommand(params);
      await s3.send(command);
      const imageUrl = `https://${process.env.BUCKET_NAME}.s3.${process.env.BUCKET_REGION}.amazonaws.com/${params.Key}`;
      imageUrls.push(imageUrl);
    }

    // console.log(req.user.id);
    const newProduct = new Product({
      name,
      description,
      condition,
      category,
      subcategory,
      imageUrls,
      userId: req.user.id,
    });
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    // console.log(error)
    return next(errorHandler(400, "A apărut o eroare la postarea produsului."));
  }
};
