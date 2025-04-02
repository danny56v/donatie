import axios from "axios";
import { SetStateAction, useEffect, useState } from "react";
import { Heading } from "../components/catalyst/heading";
import { Divider } from "../components/catalyst/divider";
import ProductCard from "../components/ProductCard";
import Pages from "../components/Pages";
import { Strong, Text } from "../components/catalyst/text";
import {CategoryFilter} from "../components/CategoryFilter";

export default function AllProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/products`, {
          params: {
            page: currentPage,
            limit: 20,
            categories: selectedCategories.join(","),
            subcategories: selectedSubcategories.join(","),
          },
        });
    
        if (res.data.data.length === 0) {
          setError("Nu s-au găsit produse");
        } else {
          setError(null);
        }
    
        setProducts(res.data.data);
        setTotalPages(res.data.pagination.totalPages);
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
    

    
      const delayFetch = setTimeout(() => {
        getProducts();
      }, 1500); // delay 500ms
    
      return () => clearTimeout(delayFetch);
  },[currentPage, selectedCategories, selectedSubcategories]); // Fetch-ul depinde de pagina curentă

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-zinc-800 dark:text-zinc-300">{error}</div>;
  }

  return (
    <>
      <Heading>Produse</Heading>
      <Divider className="my-6 dark:bg-slate-400" />
      <div className="flex flex-row sm:flex-nowrap gap-6 ">
        <div className="mt-20">
          <Strong >Categorii</Strong>
          <CategoryFilter
  selectedCategories={selectedCategories}
  setSelectedCategories={setSelectedCategories}
  selectedSubcategories={selectedSubcategories}
  setSelectedSubcategories={setSelectedSubcategories}
/>

        </div>
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
      </div>
   
    </>
  );
}
