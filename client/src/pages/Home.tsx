import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/products");
        setProducts(res.data);
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
  }, []);

  const handleClick = (id: string) => { 
    navigate(`/item/${id}`);
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="bg-white">
      <div className="mx-auto  max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-6xl lg:px-8">
        <h2 className="sr-only">Products</h2>

        <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-8">
          {products.map((product) => (
            <div  key={product._id} className="group relative flex flex-col overflow-hidden rounded-lg bg-white shadow-lg" onClick={()=>handleClick(product._id)}>
              <div className="h-32 aspect-h-3 aspect-w-3 bg-gray-200 sm:aspect-none group-hover:opacity-75 sm:h-48 ">
                <img
                  alt={product.name}
                  src={product.imageUrls[0]}
                  className="h-full w-full object-cover object-center sm:h-full sm:w-full"
                />
              </div>
              <div className="flex flex-1 flex-col space-y-2 p-4 ">
                <h3 className="text-sm font-medium text-gray-900">
                  <a href="#">
                    <span aria-hidden="true" className="absolute inset-0" />
                    {product.name}
                  </a>
                </h3>
                <p className="text-sm text-gray-500">{product.description}</p>
                <div className="flex flex-1 flex-col justify-end">
                  {/* <p className="text-sm italic text-gray-500">{product.options}</p>
                  <p className="text-base font-medium text-gray-900">{product.price}</p> */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
