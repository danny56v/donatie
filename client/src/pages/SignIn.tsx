import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { signInFailure, signInStart, signInSuccess } from "../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { RootState } from "../redux/store";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const loading = useSelector((state: RootState) => state.user.loading);
  const error = useSelector((state: RootState) => state.user.error);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };
  const handleMouseUpPassword = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({ ...prevData, [name]: value }));
    // setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      // setErrorMessage("Email și Parola sunt obligatorii.");
      dispatch(signInFailure('Toate campurile sunt obligatorii. '))
      return;
    }
    try {
      dispatch(signInStart());
      const res = await fetch("api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || data.success === false) {
        // setErrorMessage("Email sau Parola gresita!");
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      console.log(data);
      navigate("/");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      dispatch(signInFailure(errorMessage));
    }
  };
  return (
    <>
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Container
          maxWidth="sm"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            p: 2,
          }}
        >
          <Typography>Sign In</Typography>
          <form onSubmit={handleSubmit}>
            <div>
              <TextField
                error={!!error}
                label="Email"
                name="email"
                sx={{ m: 1, width: "25ch" }}
                value={formData.email}
                onChange={handleChange}
                // helperText={errorMessage}
              />
            </div>
            <div>
              <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password" error={!!error}>
                  Password
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  error={!!error}
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={showPassword ? "hide the password" : "display the password"}
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        onMouseUp={handleMouseUpPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
                {error && (
                  <Typography color="error" variant="caption" display="block">
                    {error}
                  </Typography>
                )}
              </FormControl>
            </div>
            <Button
              type="submit"
              disabled={loading}
              sx={{ m: 1, width: "25ch", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              {loading ? <CircularProgress size={24} /> : "Sign In"}
            </Button>
          </form>
          {/* <GoogleSignInButton /> */}
        </Container>
      </Box>
    </>
  );
}
