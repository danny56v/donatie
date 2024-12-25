import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signUpFailure, signUpStart, signUpSuccess } from "../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { RootState } from "../redux/store";

export default function Example() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const loading = useSelector((state: RootState) => state.user.loading);
  const error = useSelector((state: RootState) => state.user.error);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password || !formData.username)  {
      // setErrorMessage("Email și Parola sunt obligatorii.");
      dispatch(signUpFailure("Toate campurile sunt obligatorii. "));
      return;
    }
    try {
      dispatch(signUpStart());
      const res = await fetch("api/auth/signup", {
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
      dispatch(signUpSuccess(data));
      navigate("/signin");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      dispatch(signUpFailure(errorMessage));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-white">
        <body class="h-full">
        ```
      */}
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Your Company"
            src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Sign Up
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form action="#" method="POST" className="space-y-6" onSubmit={handleSubmit}>


          <div>
              <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">
                Username
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  autoComplete="username"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  onChange={handleChange}
                  value={formData.username}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  onChange={handleChange}
                  value={formData.email}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                  Password
                </label>
                {/* <div className="text-sm">
                  <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Forgot password?
                  </a>
                </div> */}
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  onChange={handleChange}
                  value={formData.password}
                />
              </div>
              {error ? <p className="text-red-600 text-xs text-end">{error}</p> : ""}
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`flex w-full justify-center rounded-md bg-gray-900 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-700
                  ${loading ? "bg-gray-600 hover:bg-gray-600 cursor-not-allowed" : ""}
                  `}
              >
                {loading ? "Loading..." : "Sign Up"}
              </button>
            </div>
          </form>
          {/* <p className="mt-10 text-center text-sm/6 text-gray-500">
            {" "}
            <a href="/signup" className="font-semibold text-gray-900 hover:text-gray-600">
              Sign Up
            </a>
          </p> */}
        </div>
      </div>
    </>
  );
}



// import { Instagram, Visibility, VisibilityOff } from "@mui/icons-material";
// import {
//   Box,
//   Button,
//   CircularProgress,
//   Container,
//   FormControl,
//   IconButton,
//   InputAdornment,
//   InputLabel,
//   OutlinedInput,
//   TextField,
//   Typography,
//   Paper,
// } from "@mui/material";
// import { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "../redux/store";
// import { useNavigate } from "react-router-dom";
// import { signUpFailure, signUpStart, signUpSuccess } from "../redux/slices/userSlice";

// export default function SignUp() {
//   const [showPassword, setShowPassword] = useState(false);
//   // const [errorMessage, setErrorMessage] = useState<string | null>(null)

//   const loading = useSelector((state: RootState) => state.user.loading);
//   const error = useSelector((state: RootState) => state.user.error);

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     email: "",
//     username: "",
//     password: "",
//   });

//   // const [errors, setErrors] = useState({
//   //   email: "",
//   //   username: "",
//   //   password: "",
//   // });

//   const handleClickShowPassword = () => setShowPassword((show) => !show);

//   const handleMouseDownPassword = (e: React.MouseEvent<HTMLButtonElement>) => {
//     e.preventDefault();
//   };
//   const handleMouseUpPassword = (e: React.MouseEvent<HTMLButtonElement>) => {
//     e.preventDefault();
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({ ...prevData, [name]: value }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // const newErrors = {
//     //   email: "",
//     //   username: "",
//     //   password: "",
//     // };

//     // // Validare simplă pentru câmpuri goale
//     // if (!formData.email) newErrors.email = "Email is required.";
//     // if (!formData.username) newErrors.username = "Username is required.";
//     // if (!formData.password) newErrors.password = "Password is required.";

//     // setErrors(newErrors);

//     // Verificăm dacă există erori înainte de a trimite formularul
//     // if (newErrors.email || newErrors.username || newErrors.password) return;

//     if (!formData.username || !formData.email || !formData.password) {
//       dispatch(signUpFailure("Toate campurile sunt obligatorii. "));
//       return;
//     }

//     try {
//       dispatch(signUpStart());
//       const res = await fetch("/api/auth/signup", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
//       });

//       const data = await res.json();
//       if (!res.ok || data.success === false) {
//         dispatch(signUpFailure(data.message));
//         return;
//       }
//       dispatch(signUpSuccess());
//       navigate('/signin')

//       // if (!response.ok || data.success === false) {
//       //   const errorData = await response.json();
//       //   // Verificăm răspunsul serverului pentru erori specifice
//       //   if (errorData.message.includes("email")) {
//       //     setErrors((prevErrors) => ({
//       //       ...prevErrors,
//       //       email: "This email is already in use.",
//       //     }));
//       //   }
//       //   if (errorData.message.includes("username")) {
//       //     setErrors((prevErrors) => ({
//       //       ...prevErrors,
//       //       username: "This username is already taken.",
//       //     }));
//       //   }
//       // } else {
//       //   // Resetare câmpuri la succes
//       //   setFormData({
//       //     email: "",
//       //     username: "",
//       //     password: "",
//       //   });
//       // }
//     } catch (error) {
//       const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
//       dispatch( (signUpFailure(errorMessage)))
//     }
//   };

//   return (
//     <Box
//       display="flex"
//       justifyContent="center"
//       alignItems="center"
//       minHeight="100vh"
//       sx={{ backgroundColor: "#f0f2f5" }}
//     >
//       <Container maxWidth="sm">
//         <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
//           <Typography variant="h4" align="center" gutterBottom>
//             Create Account
//           </Typography>
//           <form onSubmit={handleSubmit}>
//             <TextField
//               label="Email"
//               name="email"
//               fullWidth
//               margin="normal"
//               value={formData.email}
//               onChange={handleChange}
//               error={!!error}
//               // helperText={errors.email}
//               variant="outlined"
//             />
//             <TextField
//               label="Username"
//               name="username"
//               fullWidth
//               margin="normal"
//               value={formData.username}
//               onChange={handleChange}
//               error={!!error}
//               // helperText={errors.username}
//               variant="outlined"
//             />
//             <FormControl fullWidth variant="outlined" margin="normal">
//               <InputLabel htmlFor="outlined-adornment-password" error={!!error}>
//                 Password
//               </InputLabel>
//               <OutlinedInput
//                 id="outlined-adornment-password"
//                 type={showPassword ? "text" : "password"}
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 endAdornment={
//                   <InputAdornment position="end">
//                     <IconButton
//                       aria-label={showPassword ? "hide password" : "show password"}
//                       onClick={handleClickShowPassword}
//                       onMouseDown={handleMouseDownPassword}
//                       onMouseUp={handleMouseUpPassword}
//                       edge="end"
//                     >
//                       {showPassword ? <VisibilityOff /> : <Visibility />}
//                     </IconButton>
//                   </InputAdornment>
//                 }
//                 error={!!error}
//                 label="Password"
//               />
//               {error && (
//                 <Typography color="error" variant="caption" display="block">
//                 {error}
//               </Typography>
//               )}
//             </FormControl>
//             <Button
//               type="submit"
//               disabled={loading}
//               variant="contained"
//               color="primary"
//               fullWidth
//               sx={{ marginTop: 2 }}
//             >
//               {loading ? <CircularProgress size={24} color="inherit" /> : "Sign Up"}
//             </Button>
//           </form>
//         </Paper>
//       </Container>
//     </Box>
//   );
// }
