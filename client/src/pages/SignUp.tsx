import { Instagram, Visibility, VisibilityOff } from "@mui/icons-material";
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
  Paper,
} from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useNavigate } from "react-router-dom";
import { signUpFailure, signUpStart, signUpSuccess } from "../redux/slices/userSlice";

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  // const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const loading = useSelector((state: RootState) => state.user.loading);
  const error = useSelector((state: RootState) => state.user.error);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });

  // const [errors, setErrors] = useState({
  //   email: "",
  //   username: "",
  //   password: "",
  // });

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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // const newErrors = {
    //   email: "",
    //   username: "",
    //   password: "",
    // };

    // // Validare simplă pentru câmpuri goale
    // if (!formData.email) newErrors.email = "Email is required.";
    // if (!formData.username) newErrors.username = "Username is required.";
    // if (!formData.password) newErrors.password = "Password is required.";

    // setErrors(newErrors);

    // Verificăm dacă există erori înainte de a trimite formularul
    // if (newErrors.email || newErrors.username || newErrors.password) return;

    if (!formData.username || !formData.email || !formData.password) {
      dispatch(signUpFailure("Toate campurile sunt obligatorii. "));
      return;
    }

    try {
      dispatch(signUpStart());
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || data.success === false) {
        dispatch(signUpFailure(data.message));
        return;
      }
      dispatch(signUpSuccess());
      navigate('/signin')

      // if (!response.ok || data.success === false) {
      //   const errorData = await response.json();
      //   // Verificăm răspunsul serverului pentru erori specifice
      //   if (errorData.message.includes("email")) {
      //     setErrors((prevErrors) => ({
      //       ...prevErrors,
      //       email: "This email is already in use.",
      //     }));
      //   }
      //   if (errorData.message.includes("username")) {
      //     setErrors((prevErrors) => ({
      //       ...prevErrors,
      //       username: "This username is already taken.",
      //     }));
      //   }
      // } else {
      //   // Resetare câmpuri la succes
      //   setFormData({
      //     email: "",
      //     username: "",
      //     password: "",
      //   });
      // }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      dispatch( (signUpFailure(errorMessage)))
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{ backgroundColor: "#f0f2f5" }}
    >
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Create Account
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              name="email"
              fullWidth
              margin="normal"
              value={formData.email}
              onChange={handleChange}
              error={!!error}
              // helperText={errors.email}
              variant="outlined"
            />
            <TextField
              label="Username"
              name="username"
              fullWidth
              margin="normal"
              value={formData.username}
              onChange={handleChange}
              error={!!error}
              // helperText={errors.username}
              variant="outlined"
            />
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel htmlFor="outlined-adornment-password" error={!!error}>
                Password
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showPassword ? "hide password" : "show password"}
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      onMouseUp={handleMouseUpPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                error={!!error}
                label="Password"
              />
              {error && (
                <Typography color="error" variant="caption" display="block">
                {error}
              </Typography>
              )}
            </FormControl>
            <Button
              type="submit"
              disabled={loading}
              variant="contained"
              color="primary"
              fullWidth
              sx={{ marginTop: 2 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Sign Up"}
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}
