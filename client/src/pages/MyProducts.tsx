import { useEffect, useState } from "react";
import { Heading } from "../components/catalyst/heading";
import axios from "axios";
import { ProductQuickView } from "../components/ProductQuickView";

export const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/products/my-products");
        setProducts(res.data);
      } catch (error) {
        const errorMessage =
          axios.isAxiosError(error) && error.response
            ? error.response.data.message || "A apărut o eroare la preluarea produselor."
            : "A apărut o eroare neprevăzută.";

        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <div>Se încarcă anunțurile...</div>;

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <>
      <Heading className="mb-6">Anunțurile mele</Heading>
      {/* <Divider className="my-6 dark:bg-zinc-800"></Divider> */}
      <div className="">
        <ul>
          {products.map((product, index) => (
            <ProductQuickView key={product._id} index={index} product={product} />
          ))}
        </ul>
      </div>
    </>
  );
};
