import { Button } from "@mui/material";
import { Google as GoogleIcon } from "@mui/icons-material";

export default function GoogleSignInButton() {
  const handleGoogleSignIn = () => {
    // Redirecționează utilizatorul către ruta de autentificare Google
    window.location.href = "/api/auth/google";
  };

  return (
    <Button
      variant="contained"
      color="primary"
      startIcon={<GoogleIcon />}
      onClick={handleGoogleSignIn}
      sx={{ m: 1, width: "100%" }}
    >
      Sign In with Google
    </Button>
  );
}
