import { RequestHandler } from "express";
import { errorHandler } from "../utils/error";
import { Product } from "../models/Product";
import { Donation } from "../models/Donation";

export const reserveProduct: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!req.user || !req.user.id) {
      console.log(req.user, req.user.id);
      return next(errorHandler(401, "Trebuie sa fii autentificat ca sa rezervi un produs"));
    }

    const product = await Product.findById(id)
      .populate("owner", "username")
      .populate("reservedBy", " username")
      .populate("category")
      .populate("subcategory");
    if (!product) {
      return next(errorHandler(404, "Produsul nu a fost gasit"));
    }
    if (product.owner.toString() === req.user.id.toString()) {
      return next(errorHandler(403, "Nu poti rezerva un produs care iti apartine"));
    }
    if (product.reservedBy) {
      return next(errorHandler(403, "Produsul este deja rezervat"));
    }
    if (product.status !== "disponibil") {
      return next(errorHandler(400, "Produsul nu mai este disponibil pentru rezervare."));
    }

    product.status = "rezervat";
    product.reservedBy = req.user.id;

    await product.save();
    res.status(200).json(product);
  } catch (error) {
    console.log(error);
    return next(errorHandler(500, "A aparut o eroare neprevazuta la rezervarea produsului"));
  }
};

export const confirmDonation: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!req.user || !req.user.id) {
      return next(errorHandler(401, "Trebuie sa fii autentificat ca sa confirmi donatia"));
    }
    const product = await Product.findById(id);
    if (!product) {
      return next(errorHandler(404, "Produsul nu a fost gasit"));
    }
    if (product.owner.toString() !== req.user.id.toString()) {
      return next(errorHandler(403, "Nu poti confirma o donatie pentru un produs care nu iti apartine"));
    }
    if (product.status !== "rezervat") {
      return next(errorHandler(400, "Produsul nu este in asteptare pentru donatie"));
    }
    const donation = new Donation({
      product: product._id,
      owner: product.owner,
      receiver: product.reservedBy,
      confirmedAt: new Date(),
    });
    await donation.save();

    product.status = "finalizat";
    product.donationConfirmedAt = new Date();
    await product.save();
    res.status(200).json({ message: "Donatia a fost confirmata cu succes" });
  } catch (error) {
    return next(errorHandler(500, "A aparut o eroare neprevazuta la confirmarae donatiei"));
  }
};

export const cancelRezervation: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!req.user || !req.user.id) {
      return next(errorHandler(401, "Trebuie sa fii autentificat ca sa anulezi rezervarea"));
    }
    const product = await Product.findById(id)
      .populate("owner", "username")
      .populate("reservedBy", "username")
      .populate("category")
      .populate("subcategory");
    if (!product) {
      return next(errorHandler(404, "Produsul nu a fost gasit"));
    }
    if (product.status !== "rezervat") {
      return next(errorHandler(400, "Produsul nu este rezervat"));
    }
    // if (product.reservedBy?._id.toString() !== req.user.id.toString()) {
    //   return next(errorHandler(403, "Nu poti anula rezervarea pentru un produs care nu iti apartine"));
    // }

    product.status = "disponibil";
    product.reservedBy = null;
    await product.save();

    res.status(200).json(product);
  } catch (error) {
    return next(errorHandler(500, "A aparut o eroare neprevazuta la anularea rezervarii"));
  }
};

export const getDonations: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return next(errorHandler(401, "Trebuie sa fii autentificat ca sa vezi donatiile"));
    }
    const donations = await Donation.find({ $or: [{ receiver: req.user.id }, { owner: req.user.id }] })
      .populate("product")
      .populate("owner", "username")
      .populate("receiver", "username");
    res.status(200).json(donations);
  } catch (error) {
    return next(errorHandler(500, "A aparut o eroare neprevazuta la obtinerea donatiilor"));
  }
};

// export const getDonationsAsOwner: RequestHandler = async (req, res, next) => {
//   try {
//     if (!req.user || !req.user.id) {
//       return next(errorHandler(401, "Trebuie sa fii autentificat ca sa vezi donatiile"));
//     }
//     const donations = await Donation.find({ owner: req.user.id })
//       .populate("product")
//       .populate("owner", "username")
//       .populate("receiver", "username");
//     res.status(200).json(donations);
//   } catch (error) {
//     return next(errorHandler(500, "A aparut o eroare neprevazuta la obtinerea donatiilor"));
//   }
// }
