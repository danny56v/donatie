import axios from "axios";
import { Button } from "./catalyst/button";
import { Dialog, DialogActions, DialogDescription, DialogTitle } from "./catalyst/dialog";

export default function DeleteProductDialog({ productId, onClose }) {
  const handleDelete = async () => {
    try {
      await axios.delete(`/api/products/${productId}`);
      onClose();
      window.location.reload();
    } catch (error) {
      const errorMessage =
        axios.isAxiosError(error) && error.response
          ? error.response.data.message || "A apărut o eroare la autentificare."
          : "A apărut o eroare neprevăzută.";
      console.log(errorMessage);
    }
  };
  return (
    <>
      <Dialog open={true} onClose={onClose}>
        <DialogTitle>Ștergere Produs</DialogTitle>
        <DialogDescription>Ești sigur că vrei să ștergi produsul?</DialogDescription>
        <DialogActions>
          <Button plain onClick={onClose}>
            Anulare
          </Button>
          <Button onClick={handleDelete} color="red">
            Șterge
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
