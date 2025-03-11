import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux"; // Dacă folosești Redux pentru autentificare
import { ProductForm } from "../components/ProductForm";
import { RootState } from "../redux/store";
import { Heading } from "../components/catalyst/heading";
import { Divider } from "../components/catalyst/divider";

export const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.currentUser); // Asigură-te că ai user-ul autentificat
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/products/${id}`);
        const product = response.data;

        if (!user || user.id !== product.owner._id) {
          alert("Nu ai permisiunea să editezi acest anunț.");
          navigate("/");
          return;
        }

        setIsOwner(true);
      } catch (error) {
        console.error("Eroare la preluarea produsului:", error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, user, navigate]);

  if (loading) {
    return <p>Se încarcă...</p>;
  }

  return isOwner ? (
    <>
      <Heading>Modifică anunț</Heading>
      <Divider className="my-6 dark:bg-slate-400"></Divider>
      
      <ProductForm />

    </>
  ) : null;
};
