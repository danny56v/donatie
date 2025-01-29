import axios from "axios";
import { SetStateAction, useEffect, useState } from "react";
import { Heading } from "../components/catalyst/heading";
import { Divider } from "../components/catalyst/divider";
import ProductCard from "../components/ProductCard";
import Pages from "../components/Pages";

export default function AllProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/products?page=${currentPage}&limit=20`); // Trimitem pagina curentă și limita
        setProducts(res.data.data); // Setăm produsele din răspuns
        setTotalPages(res.data.pagination.totalPages); // Total pagini din răspuns
        setLoading(false);
      } catch (error) {
        const errorMessage =
          axios.isAxiosError(error) && error.response
            ? error.response.data.message || "A apărut o eroare la preluarea produselor."
            : "A apărut o eroare neprevăzută.";
        setLoading(false);
        setError(errorMessage);
      }
    };

    getProducts();
  }, [currentPage]); // Fetch-ul depinde de pagina curentă

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <Heading>Products</Heading>
      <Divider className="my-6 dark:bg-slate-400" />
      <div className="bg-white dark:bg-zinc-900">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-6xl lg:px-8">
          {/* <h2 className="">Products</h2> */}

          <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-8">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} height={48} />
            ))}
          </div>
        </div>
        <Pages
          currentPage={currentPage}
          totalPages={totalPages}
          onChange={(page: SetStateAction<number>) => setCurrentPage(page)} // Actualizează pagina curentă
        />
      </div>
    </>
  );
}
