import { RequestHandler } from "express";
import { Product } from "../models/Product";
import { errorHandler } from "../utils/error";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../utils/s3Config";
import sharp from "sharp";
import { Subcategory } from "../models/Subcategory";

export const getAllProducts: RequestHandler = async (req, res, next) => {
  try {
    const { page = "1", limit = "10" } = req.query;

    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);

    const startIndex = (pageNumber - 1) * limitNumber;

    const products = await Product.find().skip(startIndex).limit(limitNumber).sort({ createdAt: -1 });

    const totalProducts = await Product.countDocuments();

    res.status(200).json({
      data: products,
      pagination: {
        totalProducts,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalProducts / limitNumber),
      },
    });
  } catch (error) {
    return next(errorHandler(400, "A aparut o eroare la paginare"));
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
    const { name, description, condition, category, subcategory, region, city, address, phone } = req.body;
    // console.log(req.body)
    if (!name || !description || !condition || !category || !subcategory || !region || !city || !address || !phone) {
      return next(errorHandler(400, "Introduceti datele in toate campurile"));
    }
    const imageUrls: string[] = [];

    for (const file of files) {
      const resizedImageBuffer = await sharp(file.buffer)
        .resize({ width: 1980, height: 1200, fit: "inside" })
        .toBuffer();
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
      region,
      city,
      address,
      phone,
      imageUrls,
      userId: req.user.id,
    });
    const savedProduct = await newProduct.save();
    await Subcategory.findByIdAndUpdate(subcategory, {
      $push: { products: savedProduct._id },
    });
    res.status(201).json(savedProduct);
  } catch (error) {
    // console.log(error)
    return next(errorHandler(400, "A apărut o eroare la postarea produsului."));
  }
};

export const getRecommendedProducts: RequestHandler = async (req, res, next) => {
  const { subcategoryId, productId } = req.params;

  try {
    const subcategory = await Subcategory.findById(subcategoryId).populate({
      path: "products",
      match: { _id: { $ne: productId } },
      options: { limit: 5 },
      select: "name description imageUrls",
    });
    console.log(subcategory);
    if (!subcategory || !subcategory.products || subcategory.products.length === 0) {
      res.status(200).json({ message: "Nu sunt recomandari disponibile pentru această subcategorie." });
      return;
    }

    const recommendedProducts = (subcategory.products as any[]).map((product) => ({
      ...product.toObject(),
      imageUrls: product.imageUrls.slice(0, 1),
    }));
    res.status(200).json(recommendedProducts);
  } catch (error) {
    return next(errorHandler(400, "A apărut o eroare la gasirea recomandarilor."));
  }
};

export const pagination: RequestHandler = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);

    const startIndex = (pageNumber - 1) * limitNumber;

    const products = await Product.find().skip(startIndex).limit(limitNumber).sort({ createdAt: -1 });

    const totalProducts = await Product.countDocuments();

    res.status(200).json({
      data: products,
      pagination: {
        totalProducts,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalProducts / limitNumber),
      },
    });
  } catch (error) {
    return next(errorHandler(400, "A aparut o eroare la paginare"));
  }
};

export const getUserProducts: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const products = await Product.find({ userId: userId })
    .populate("category", "name")
    .populate("subcategory", "name")
    .select("name description imageUrls condition category subcategory createdAt updatedAt")
    // .lean(); // ✅ `.lean()` trebuie să vină după `.populate()`
    
    const formattedProducts = products.map((product) => ({
      _id:product._id,
      name: product.name,
      description: product.description,
      image: product.imageUrls?.[0] || null, // Prima imagine sau null dacă nu există
      category: product.category,
      subcategory: product.subcategory,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }));

    res.status(200).json(formattedProducts);
  } catch (error) {
    return next(errorHandler(400, "A aparut o eroare la gasirea anunturilor"));
  }
};
