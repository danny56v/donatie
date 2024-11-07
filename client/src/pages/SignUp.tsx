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
  Paper,
} from "@mui/material";
import { useState } from "react";

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    username: "",
    password: "",
  });

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      email: "",
      username: "",
      password: "",
    };

    // Validare simplă pentru câmpuri goale
    if (!formData.email) newErrors.email = "Email is required.";
    if (!formData.username) newErrors.username = "Username is required.";
    if (!formData.password) newErrors.password = "Password is required.";

    setErrors(newErrors);

    // Verificăm dacă există erori înainte de a trimite formularul
    if (newErrors.email || newErrors.username || newErrors.password) return;

    setIsLoading(true);

    try {
      const response = await fetch("api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json()

      if (!response.ok || data.success ===false) {
        const errorData = await response.json();
        // Verificăm răspunsul serverului pentru erori specifice
        if (errorData.message.includes("email")) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            email: "This email is already in use.",
          }));
        }
        if (errorData.message.includes("username")) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            username: "This username is already taken.",
          }));
        }
      } else {
        // Resetare câmpuri la succes
        setFormData({
          email: "",
          username: "",
          password: "",
        });
      }
    } catch (error) {
      console.error("Error creating user:", error);
    } finally {
      setIsLoading(false);
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
              error={!!errors.email}
              helperText={errors.email}
              variant="outlined"
            />
            <TextField
              label="Username"
              name="username"
              fullWidth
              margin="normal"
              value={formData.username}
              onChange={handleChange}
              error={!!errors.username}
              helperText={errors.username}
              variant="outlined"
            />
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel htmlFor="outlined-adornment-password" error={!!errors.password}>
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
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                error={!!errors.password}
                label="Password"
              />
              {errors.password && (
                <Typography variant="body2" color="error">
                  {errors.password}
                </Typography>
              )}
            </FormControl>
            <Button
              type="submit"
              disabled={isLoading}
              variant="contained"
              color="primary"
              fullWidth
              sx={{ marginTop: 2 }}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : "Sign Up"}
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}
