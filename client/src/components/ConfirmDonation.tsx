import axios from "axios";
import { Button } from "./catalyst/button";
import { Heading } from "./catalyst/heading";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

export const ConfirmDonation = ({reservedByUsername, refreshProduct, productId, setError}) => {
    const user = useSelector((state: RootState) => state.user.currentUser);

    const handleConfirmDonation = async () => {
        try {
            if (!user || !user.id) {
                setError("Trebuie să fii autentificat pentru a confirma donația.");
                return;
              }
    await axios.put(`/api/products/${productId}/confirm`); // Apelează endpoint-ul de confirmare a donației produsului      
                refreshProduct()
            } catch (error) {
                const errorMessage =
                axios.isAxiosError(error) && error.response
                ? error.response.data.message || "A apărut o eroare la confirmarea donației."
                : "A apărut o eroare neprevăzută.";
                setError(errorMessage);
            }
        };

    const handleCancelReservation = async () => {
        try {
            if (!user || !user.id) {
                setError("Trebuie să fii autentificat pentru a anula rezervarea.");
                return;
              }
    await axios.put(`/api/products/${productId}/cancel`); // Apelează endpoint-ul de anulare a rezervării produsului
    
              refreshProduct()
          } catch (error) {
              const errorMessage =
              axios.isAxiosError(error) && error.response
              ? error.response.data.message || "A apărut o eroare la anularea rezervării."
              : "A apărut o eroare neprevăzută.";
              setError(errorMessage);
          }
      };
  return (
    <>
      <div className="flex-1 flex flex-col justify-start items-center md:flex-row gap-4">
        <Heading level={3}>Produs rezervat de: {reservedByUsername}</Heading>
        <div className="flex-col md:flex-row space-x-4">
          <Button outline onClick={handleCancelReservation}>Anuleaza Rezervare</Button>
          <Button onClick={handleConfirmDonation}>Confirma Donatia</Button>
        </div>
      </div>
    </>
  );
};