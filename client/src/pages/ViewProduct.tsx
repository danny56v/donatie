import { useEffect, useState } from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ImageModal from "../components/ImageModal";
import Message from "../components/Message";
import { Heading } from "../components/catalyst/heading";
import { Divider } from "../components/catalyst/divider";
import Description from "../components/Description";
import ProductCard from "../components/ProductCard";
import { TextLink } from "../components/catalyst/text";

interface IProduct {
  _id: string;
  name: string;
  description: string;
  condition: string;
  category: { _id: string; name: string };
  subcategory: { _id: string, name: string };
  imageUrls: string[];
  owner: string;
}

export default function ViewProduct() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  const [product, setProduct] = useState<IProduct | null>(null);
  const [recommendedProducts, setRecommendedProducts] = useState<IProduct[]>([]);

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        console.log(id)
        const res = await axios.get(`/api/products/${id}`);
        console.log(res)
        setProduct(res.data);
      } catch (error) {
        const errorMessage =
          axios.isAxiosError(error) && error.response
            ? error.response.data.message || "A apărut o eroare la autentificare."
            : "A apărut o eroare neprevăzută.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);


  useEffect(() => {
    if (product && product.subcategory && product.subcategory._id) {
      const fetchRecommendedProducts = async () => {
        try {
          const res = await axios.get(`/api/products/recommended/${product.subcategory._id}/${product._id}`,);

          setRecommendedProducts(res.data);

        } catch (error) {
          const errorMessage =
            axios.isAxiosError(error) && error.response
              ? error.response.data.message || "A apărut o eroare la autentificare."
              : "A apărut o eroare neprevăzută.";
          setError(errorMessage);
        }
      };
      fetchRecommendedProducts();
    }
  }, [product]);

  const handleClick = (id: string) => {
    navigate(`/product/${id}`);
  };

  const handleImageClick = (image: string, index: number) => {
    setModalOpen(true);
    setCurrentImageIndex(index);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <>
      <Heading>Produs: {product.name}</Heading>
      <Divider className="my-6 dark:bg-slate-400"></Divider>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 max-w-lg lg:w-0.5 mx-auto">
          <TabGroup className="flex flex-col">
            <TabPanels className="justify-center">
              {product.imageUrls.map((image: string, index: number) => (
                <TabPanel key={image}>
                  <div className="h-[400px] w-[500px] object-contain">
                    <img
                      alt={image}
                      src={image}
                      onClick={() => handleImageClick(image, index)}
                      className="h-full w-full object-contain object-center sm:rounded-lg"
                    />
                  </div>
                </TabPanel>
              ))}
            </TabPanels>
            <div className="mt-4 flex overflow-hidden pr-10">
              <TabList className="flex overflow-x-scroll space-x-4 pb-5 scrollbar-thin">
                {product.imageUrls.map((image: string, index: number) => (
                  <Tab
                    key={image}
                    className="flex-shrink-0 w-24 h-24 cursor-pointer rounded-md bg-white dark:bg-zinc-800 shadow-md dark:shadow-zinc-400"
                  >
                    <img alt={`Preview ${index}`} src={image} className="h-full w-full object-cover rounded-md" />
                  </Tab>
                ))}
              </TabList>
            </div>
          </TabGroup>
        </div>
        <div className="flex-1">
          <Description product={product} />

        </div>
      </div>
      <div className="mt-10">
        <div className="flex flex-row justify-between">
        <Heading className="mb-5">Produse Similare</Heading>
        <TextLink href='#'>Vezi mai multe</TextLink>
        </div>
        {recommendedProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-8">
            {recommendedProducts.map((product: IProduct) => (
              <ProductCard key={product._id} product={product} height={32}/>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">Nu există produse recomandate.</p>
        )}
      </div>

      {modalOpen && (
        <ImageModal
          open={modalOpen}
          setOpen={setModalOpen}
          images={product.imageUrls}
          currentImageIndex={currentImageIndex}
          setCurrentImageIndex={setCurrentImageIndex}
        />
      )}
    </>
  );
}
