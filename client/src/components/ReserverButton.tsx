import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useState } from "react";
import axios from "axios";
import { Button } from "./catalyst/button";

export const ReserverButton = ({ product, setProduct, refreshProduct }) => {
  const user = useSelector((state: RootState) => state.user.currentUser);
  const [error, setError] = useState<string | null>(null);
  const handleReserve = async () => {
    try {
      if (!user || !user.id) {
        setError("Trebuie să fii autentificat pentru a rezerva un produs.");
        return;
      }
 await axios.put(`/api/products/${product._id}/reserve`);

      refreshProduct()
    } catch (error) {
      const errorMessage =
        axios.isAxiosError(error) && error.response
          ? error.response.data.message || "A apărut o eroare la rezervarea produsului."
          : "A apărut o eroare neprevăzută.";
      setError(errorMessage);
    }
  };
//   console.log(product.reservedBy, user.id)
  const handleCancelReservation = async () => {
      try {
          if (!user || !user.id) {
              setError("Trebuie să fii autentificat pentru a anula rezervarea.");
              return;
            }
await axios.put(`/api/products/${product._id}/cancel`);

            refreshProduct()
        } catch (error) {
            const errorMessage =
            axios.isAxiosError(error) && error.response
            ? error.response.data.message || "A apărut o eroare la anularea rezervării."
            : "A apărut o eroare neprevăzută.";
            setError(errorMessage);
        }
    };
    
    // console.log(user.id, product.owner._id)
    if ( user?.id === product.owner._id) return null

  return  <div className="flex">
   
  {product.status === "disponibil" && ( !user || user.id !== product.owner._id ) ? (
     <Button onClick={handleReserve}  disabled={product.status !== "disponibil"}>Rezervare</Button>
  ) : product.status === "rezervat" && (user && user.id === product.reservedBy._id) ? (
    <Button onClick={handleCancelReservation} color="red" >
      Anulează rezervarea
    </Button>
  ) : null}

  {error && <p className="text-red-500">{error}</p>}
</div>;
};
