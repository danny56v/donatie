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

import { useState } from "react";

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };
  const handleMouseUpPassword = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };

  return (
    <>
    <Box
    display="flex"
    justifyContent='center'
    alignItems='center'
    minHeight='100vh'
    >
      <Container maxWidth='sm'
      sx={{ 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}>
        <div>SignUp</div>

        <div>
          <TextField
            label="Email"
            //   id="outlined-start-adornment"
            sx={{ m: 1, width: "25ch" }}
            //   slotProps={{
            //     input: {
            //       startAdornment: <InputAdornment position="start">kg</InputAdornment>,
            //     },
            //   }}
          />
        </div>
        <div>
          <TextField label="Username" sx={{ m: 1, width: "25ch" }} />
        </div>
        <div>
          <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">
              Password
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={showPassword ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      showPassword
                        ? "hide the password"
                        : "display the password"
                    }
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
        <Button>Sign Up</Button>
      </Container>
      </Box>
    </>
  );
}
