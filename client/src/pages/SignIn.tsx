import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import axios from "axios";

import { useState } from "react";
import { ResponseApi } from "../utils/Response";
import GoogleSignInButton from "../components/GoogleSignInButton";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  // const [email, setEmail] = useState("");
  // const [username, setUsername] = useState("");

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
  // const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setUsername(e.target.value);
  //   console.log(username);
  // };
  // const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setEmail(e.target.value);
  //   console.log(email);
  // };

  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault()
try {
    const response = await axios.post<ResponseApi>('api/auth/signin', formData)
    
} catch (error) {
  console.error("Error creating user:", error);
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
          <div>SignUp</div>
          <form onSubmit={handleSubmit}>
            <div>
              <TextField
                label="Email"
                name="email"
                //   id="outlined-start-adornment"
                sx={{ m: 1, width: "25ch" }}
                value={formData.email}
                onChange={handleChange}
                //   slotProps={{
                //     input: {
                //       startAdornment: <InputAdornment position="start">kg</InputAdornment>,
                //     },
                //   }}
              />
            </div>
            <div>
              <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
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
              </FormControl>
            </div>
            <Button type="submit">Sign In</Button>
          </form>
          <GoogleSignInButton/>
        </Container>
      </Box>
    </>
  );
}
