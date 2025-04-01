import { RequestHandler } from "express";
import { Product } from "../models/Product";
import { errorHandler } from "../utils/error";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../utils/s3Config";
import sharp from "sharp";
import { Subcategory } from "../models/Subcategory";
import mongoose from "mongoose";
import { Category } from "../models/Category";


export const getAllProducts: RequestHandler = async (req, res, next) => {
  try {
    const { page = "1", limit = "10", categories, subcategories } = req.query;

    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const startIndex = (pageNumber - 1) * limitNumber;

    const filter: any = {};

    const categoryFilter = categories ? { category: { $in: categories.toString().split(',') } } : {};
    const subcategoryFilter = subcategories ? { subcategory: { $in: subcategories.toString().split(',') } } : {};

    // Aplicăm un filtru care include produse din categoriile sau subcategoriile specificate
    if (categories || subcategories) {
      filter.$or = [];
      if (categories) {
        filter.$or.push(categoryFilter);
      }
      if (subcategories) {
        filter.$or.push(subcategoryFilter);
      }
    }

    // console.log(filter)
    const products = await Product.find(filter)
                                  .skip(startIndex)
                                  .limit(limitNumber)
                                  .sort({ createdAt: -1 });

    const totalProducts = await Product.countDocuments(filter);

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



// export const getAllProducts: RequestHandler = async (req, res, next) => {
//   try {
//     const { page = "1", limit = "10" } = req.query;

//     const pageNumber = parseInt(page as string, 10);
//     const limitNumber = parseInt(limit as string, 10);

//     const startIndex = (pageNumber - 1) * limitNumber;

//     const products = await Product.find().skip(startIndex).limit(limitNumber).sort({ createdAt: -1 });
//     // console.log(products);
//     const totalProducts = await Product.countDocuments();
//     // if (products.length === 0) {
//     //    res.status(200).json()
//     //    return
//     // }
//     res.status(200).json({
//       data: products,
//       pagination: {
//         totalProducts,
//         currentPage: pageNumber,
//         totalPages: Math.ceil(totalProducts / limitNumber),
//       },
//     });
//   } catch (error) {
//     return next(errorHandler(400, "A aparut o eroare la paginare"));
//   }
// };

export const getProductById: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id)
      .populate("owner", "username")
      .populate("category")
      .populate("subcategory")
      .populate("reservedBy", "username");
    if (!product) {
      return next(errorHandler(404, "Produsul nu a fost gasit."));
    }
    res.status(200).json(product);
  } catch (error) {
    console.log(error);
    return next(errorHandler(400, "A apărut o eroare la preluarea produsului."));
  }
};

export const createProduct: RequestHandler = async (req, res, next) => {
  console.log(req.files);
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
      owner: req.user.id,
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

export const updateProduct: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return next(errorHandler(404, "Produsul nu a fost găsit."));
    }

    if (product.owner.toString() !== req.user.id) {
      return next(errorHandler(403, "Nu ai permisiunea să editezi acest produs."));
    }

    const { name, description, condition, category, subcategory, region, city, address, phone } = req.body;

    // ✅ 1. Normalizează `remainingImages`
    let remainingImages = req.body.remainingImages;
    if (!Array.isArray(remainingImages)) {
      remainingImages = remainingImages ? [remainingImages] : []; // Convertim în array dacă e string sau undefined
    }
    console.log("📌 Imagini păstrate:", remainingImages);

    // ✅ 2. Identifică imaginile de șters
    const imagesToDelete = product.imageUrls.filter((img) => !remainingImages.includes(img));
    console.log("🗑️ Imagini de șters:", imagesToDelete);

    // ✅ 3. Șterge imaginile din S3
    for (const imageUrl of imagesToDelete) {
      const imageKey = imageUrl.split("/").pop();
      if (imageKey) {
        console.log("❌ Ștergere din S3:", imageKey);
        const deleteParams = {
          Bucket: process.env.BUCKET_NAME,
          Key: imageKey,
        };
        await s3.send(new DeleteObjectCommand(deleteParams));
      }
    }

    // ✅ 4. Încărcă noile imagini dacă sunt trimise
    const files = req.files as Express.Multer.File[] | undefined;
    let newImageUrls: string[] = [];

    if (files && files.length > 0) {
      for (const file of files) {
        const resizedImageBuffer = await sharp(file.buffer)
          .resize({ width: 1980, height: 1200, fit: "inside" })
          .toBuffer();

        const newImageKey = `${Date.now()}-${file.originalname}`;
        const uploadParams = {
          Bucket: process.env.BUCKET_NAME,
          Key: newImageKey,
          Body: resizedImageBuffer,
          ContentType: file.mimetype,
        };

        await s3.send(new PutObjectCommand(uploadParams));

        const newImageUrl = `https://${process.env.BUCKET_NAME}.s3.${process.env.BUCKET_REGION}.amazonaws.com/${newImageKey}`;
        newImageUrls.push(newImageUrl);
      }
    }

    // ✅ 5. Combină imaginile rămase cu cele noi și elimină duplicate
    const updatedImageUrls = [...new Set([...remainingImages, ...newImageUrls])];
    console.log("🖼️ Imagini finale salvate:", updatedImageUrls);

    // ✅ 6. Actualizează produsul în baza de date
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        description,
        condition,
        category,
        subcategory,
        region,
        city,
        address,
        phone,
        imageUrls: updatedImageUrls,
      },
      { new: true }
    );

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("❌ Eroare la actualizare:", error);
    return next(errorHandler(400, "A apărut o eroare la actualizarea produsului."));
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

    const products = await Product.find({ owner: userId })
      .sort({ createdAt: -1 })
      .populate("category", "name")
      .populate("subcategory", "name")
      .populate("owner")
      .select("name description imageUrls condition category subcategory createdAt updatedAt owner");
    // .lean(); // ✅ `.lean()` trebuie să vină după `.populate()`

    const formattedProducts = products.map((product) => ({
      _id: product._id,
      name: product.name,
      description: product.description,
      image: product.imageUrls?.[0] || null, // Prima imagine sau null dacă nu există
      category: product.category,
      subcategory: product.subcategory,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      owner: product.owner,
    }));

    res.status(200).json(formattedProducts);
  } catch (error) {
    return next(errorHandler(400, "A aparut o eroare la gasirea anunturilor"));
  }
};

export const deleteProduct: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return next(errorHandler(404, "Produsul nu a fost găsit."));
    }

    if (product.owner.toString() !== req.user.id) {
      return next(errorHandler(403, "Nu ai permisiunea să ștergi acest produs."));
    }

    // **Ștergere imagini din S3**
    for (const imageUrl of product.imageUrls) {
      const imageKey = imageUrl.split("/").pop();
      if (imageKey) {
        try {
          await s3.send(
            new DeleteObjectCommand({
              Bucket: process.env.BUCKET_NAME,
              Key: imageKey,
            })
          );
        } catch (err) {
          console.error(`❌ Eroare la ștergerea imaginii din S3: ${imageKey}`, err);
        }
      }
    }

    // **Șterge produsul din baza de date**
    await Product.findByIdAndDelete(id);

    // **Șterge produsul din subcategorie**
    await Subcategory.findByIdAndUpdate(product.subcategory, {
      $pull: { products: id },
    });

    res.status(200).json({ message: "Produs șters cu succes." });
  } catch (error) {
    console.error("❌ Eroare la ștergerea produsului:", error);
    return next(errorHandler(400, "A apărut o eroare la ștergerea produsului."));
  }
};
