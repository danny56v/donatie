import { Button } from "./catalyst/button";
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from "./catalyst/dialog";
import { Field, Label } from "./catalyst/fieldset";
import { Input } from "./catalyst/input";
import { useState } from "react";

interface DeleteUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteUserDialog = ({ isOpen, onClose, onConfirm }: DeleteUserDialogProps) => {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Șterge utilizatorul</DialogTitle>
      <DialogDescription>
        Această acțiune este ireversibilă. Sigur dorești să continui?
      </DialogDescription>
      <DialogBody>
        <p className="text-sm text-zinc-600">Utilizatorul va fi șters permanent.</p>
      </DialogBody>
      <DialogActions>
        <Button plain onClick={onClose}>Anulează</Button>
        <Button color="red" onClick={onConfirm}>Șterge</Button>
      </DialogActions>
    </Dialog>
  );
};

