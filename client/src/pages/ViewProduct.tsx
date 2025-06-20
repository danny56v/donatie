import { useEffect, useState } from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ImageModal from "../components/ImageModal";
import { Heading } from "../components/catalyst/heading";
import { Divider } from "../components/catalyst/divider";
import Description from "../components/Description";
import ProductCard from "../components/ProductCard";
import { Strong, TextLink } from "../components/catalyst/text";
import DeleteProductDialog from "../components/DeleteProductDialog";
import { Button } from "../components/catalyst/button";
import { PencilIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { TrashIcon } from "@heroicons/react/20/solid";
import { Badge } from "../components/catalyst/badge";
import { ReserverButton } from "../components/ReserverButton";
import { ConfirmDonation } from "../components/ConfirmDonation";

interface IProduct {
  _id: string;
  name: string;
  description: string;
  condition: string;
  category: { _id: string; name: string };
  subcategory: { _id: string; name: string };
  imageUrls: string[];
  status: "disponibil" | "rezervat" | "finalizat";
  owner: { _id: string; username: string };
  reservedBy: { _id: string; username: string } | null;
  donationConfirmedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  region: string;
  city: string;
  address: string;
  phone: number;

}
export default function ViewProduct() {
  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.user.currentUser);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  const [product, setProduct] = useState<IProduct | null>(null);
  const [recommendedProducts, setRecommendedProducts] = useState<IProduct[]>([]);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [triggerUpdate, setTriggerUpdate] = useState(false);

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // console.log(id);
        const res = await axios.get(`/api/products/${id}`);
        // console.log(res);
        setProduct(res.data);
      } catch (error) {
        const errorMessage =
          axios.isAxiosError(error) && error.response
            ? error.response.data.message || "A apărut o eroare la gasirea produsului."
            : "A apărut o eroare neprevăzută.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, triggerUpdate]);

  const refreshProduct = () => setTriggerUpdate((prev) => !prev);

  useEffect(() => {
    if (product && product.subcategory && product.subcategory._id) {
      const fetchRecommendedProducts = async () => {
        try {
          const res = await axios.get(`/api/products/recommended/${product.subcategory._id}/${product._id}`);

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

  const handleDeleteProduct = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleImageClick = (image: string, index: number) => {
    setModalOpen(true);
    setCurrentImageIndex(index);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!product) return <div>Product not found</div>;

  console.log(product);
  return (
    <>
      <div className="flex flex-row gap-4">
        <Heading>
          Produs: {product.name}{" "}
          {product.donationConfirmedAt && <span className="text-green-600 ml-2">(Produs Donat)</span>}
        </Heading>

        {product.status === "disponibil" && <Badge color="green">Disponibil</Badge>}
        {product.status === "rezervat" && <Badge color="rose">Rezervat</Badge>}
      </div>
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
        <div className="flex-1 flex-row space-y-6">
          <Description product={product} />
          {product.donationConfirmedAt && <Heading className="text-green-600 ml-2">Produsul este deja Donat</Heading>}
          {user?.id !== product.owner._id && (
            <ReserverButton product={product} setProduct={setProduct} refreshProduct={refreshProduct} />
          )}
          {user && user.id === product.owner._id && (
            <div className="flex-1 flex justify-start items-center ">
              <Button plain onClick={() => navigate(`/product/edit/${product._id}`)}>
                <PencilIcon></PencilIcon>Modifică
              </Button>
              /
              <Button plain onClick={handleDeleteProduct}>
                <TrashIcon></TrashIcon>
                Șterge
              </Button>
            </div>
          )}
          {user && user.id === product.owner._id && product.status === "rezervat" && (
            <ConfirmDonation
              reservedByUsername={product.reservedBy.username}
              refreshProduct={refreshProduct}
              productId={product._id}
              setError={setError}
            />
          )}
        </div>
      </div>
      <div className="mt-10">
        <div className="flex flex-row justify-between">
          <Heading className="mb-5">Produse Similare</Heading>
          <TextLink href="#">Vezi mai multe</TextLink>
        </div>
        {recommendedProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-8">
            {recommendedProducts.map((product: IProduct) => (
              <ProductCard key={product._id} product={product} height={32} />
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
      {isDeleteDialogOpen && (
        <DeleteProductDialog productId={product._id} onClose={() => setIsDeleteDialogOpen(false)} />
      )}
    </>
  );
}
