import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signInFailure, signInStart, signInSuccess } from "../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { RootState } from "../redux/store";

export default function Example() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const loading = useSelector((state: RootState) => state.user.loading);
  const error = useSelector((state: RootState) => state.user.error);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      // setErrorMessage("Email și Parola sunt obligatorii.");
      dispatch(signInFailure("Toate campurile sunt obligatorii. "));
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
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      dispatch(signInFailure(errorMessage));
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
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form action="#" method="POST" className="space-y-6" onSubmit={handleSubmit}>
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
                {loading ? "Loading..." : "Sign in"}
              </button>
            </div>
          </form>
          <p className="mt-10 text-center text-sm/6 text-gray-500">
            {" "}
            <a href="/signup" className="font-semibold text-gray-900 hover:text-gray-600">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </>
  );
}

// import { Visibility, VisibilityOff } from "@mui/icons-material";
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
// } from "@mui/material";

// import { useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { signInFailure, signInStart, signInSuccess } from "../redux/slices/userSlice";
// import { useNavigate } from "react-router-dom";
// import { RootState } from "../redux/store";

// export default function SignIn() {
//   const [showPassword, setShowPassword] = useState(false);
//   // const [errorMessage, setErrorMessage] = useState<string | null>(null);
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const loading = useSelector((state: RootState) => state.user.loading);
//   const error = useSelector((state: RootState) => state.user.error);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

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
//     // setErrorMessage(null);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!formData.email || !formData.password) {
//       // setErrorMessage("Email și Parola sunt obligatorii.");
//       dispatch(signInFailure('Toate campurile sunt obligatorii. '))
//       return;
//     }
//     try {
//       dispatch(signInStart());
//       const res = await fetch("api/auth/signin", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
//       });

//       const data = await res.json();
//       if (!res.ok || data.success === false) {
//         // setErrorMessage("Email sau Parola gresita!");
//         dispatch(signInFailure(data.message));
//         return;
//       }
//       dispatch(signInSuccess(data));
//       // console.log(data);
//       navigate("/");
//     } catch (error) {
//       const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
//       dispatch(signInFailure(errorMessage));
//     }
//   };
//   return (
//     <>
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
//         <Container
//           maxWidth="sm"
//           sx={{
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             justifyContent: "center",
//             p: 2,
//           }}
//         >
//           <Typography>Sign In</Typography>
//           <form onSubmit={handleSubmit}>
//             <div>
//               <TextField
//                 error={!!error}
//                 label="Email"
//                 name="email"
//                 sx={{ m: 1, width: "25ch" }}
//                 value={formData.email}
//                 onChange={handleChange}
//                 // helperText={errorMessage}
//               />
//             </div>
//             <div>
//               <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
//                 <InputLabel htmlFor="outlined-adornment-password" error={!!error}>
//                   Password
//                 </InputLabel>
//                 <OutlinedInput
//                   id="outlined-adornment-password"
//                   error={!!error}
//                   type={showPassword ? "text" : "password"}
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   endAdornment={
//                     <InputAdornment position="end">
//                       <IconButton
//                         aria-label={showPassword ? "hide the password" : "display the password"}
//                         onClick={handleClickShowPassword}
//                         onMouseDown={handleMouseDownPassword}
//                         onMouseUp={handleMouseUpPassword}
//                         edge="end"
//                       >
//                         {showPassword ? <VisibilityOff /> : <Visibility />}
//                       </IconButton>
//                     </InputAdornment>
//                   }
//                   label="Password"
//                 />
//                 {error && (
//                   <Typography color="error" variant="caption" display="block">
//                     {error}
//                   </Typography>
//                 )}
//               </FormControl>
//             </div>
//             <Button
//               type="submit"
//               disabled={loading}
//               sx={{ m: 1, width: "25ch", display: "flex", alignItems: "center", justifyContent: "center" }}
//             >
//               {loading ? <CircularProgress size={24} /> : "Sign In"}
//             </Button>
//           </form>
//           {/* <GoogleSignInButton /> */}
//         </Container>
//       </Box>
//     </>
//   );
// }
