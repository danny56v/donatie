import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import ErrorPage from "./ErrorPage.tsx";
import SignIn from "./pages/SignIn.tsx";
import SignUp from "./pages/SignUp.tsx";
import { Provider } from "react-redux";
import { store } from "./redux/store.ts";
import Layout from "./components/Layout.tsx";
import CreateProduct from "./pages/CreateProduct.tsx";
import { ThemeProvider } from "@material-tailwind/react";

const router = createBrowserRouter([


  {
    path: '/',
    element: <Layout/>,
    children: [
      { path: "/", element: <App /> },        
      { path: "signin", element: <SignIn /> },
      { path: "signup", element: <SignUp /> },
      { path: "product", element: <CreateProduct/>}
    ]
  }

  // {
  //   path: "/",
  //   element: <App />,
  //   errorElement: <ErrorPage />,
  // },
  // {
  //   path: "/signup",
  //   element: <SignUp />,
  // },
  // {
  //   path: "/signin",
  //   element: <SignIn />,
  // },
]);

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <ThemeProvider>
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
    </ThemeProvider>
  </Provider>
);
