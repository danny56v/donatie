import axios from "axios";
import { useEffect, useState } from "react";
import { ProductQuickView } from "./ProductQuickView";
import { ICategory, ISubcategory } from "../interfaces/Interfaces";
interface IProduct {
  _id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: ICategory;
  subcategory: ISubcategory;
  status: "disponibil" | "rezervat" | "finalizat";
  condition: string;
  region: string;
  city: string;
  address: string;
  phone: number;
  owner: { _id: string; username: string };
  reservedBy: { _id: string; username: string } | null;
  donationConfirmedAt: Date | null;
  createdAt: string;
  updatedAt: string;
}

export const AdminProducts = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/admin/allproducts");
        console.log(res.data);
        setProducts(res.data.products);
        setLoading(false);
      } catch (error) {
        const errorMessage =
          axios.isAxiosError(error) && error.response
            ? error.response.data.message || "A apărut o eroare la autentificare."
            : "A apărut o eroare neprevăzută.";
        setError(errorMessage);
      }
    };
    fetchProducts();
  }, []);

  return (
    <>
      {products.map((product, index) => (
        <ProductQuickView key={product._id} index={index} product={product} />
      ))}
    </>
  );
};
