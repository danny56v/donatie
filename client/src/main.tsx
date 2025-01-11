import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import SignIn from "./pages/SignIn.tsx";
import SignUp from "./pages/SignUp.tsx";
import { Provider } from "react-redux";
import { store } from "./redux/store.ts";
import Layout from "./components/Layout.tsx";
import CreateItem from "./pages/CreateItem.tsx";
import { ThemeProvider } from "@material-tailwind/react";
import PrivateRoute from "./components/PrivateRoute.tsx";
import ViewItem from "./pages/ViewItem.tsx";

const router = createBrowserRouter([


  {
    path: '/',
    element: <Layout/>,
    children: [
      { path: "/", element: <App /> },        
      { path: "signin", element: <SignIn /> },
      { path: "signup", element: <SignUp /> },
      {path: "/item/:id", element:<ViewItem/>},
      {
        path: 'item',
        element: (
          <PrivateRoute>
            <CreateItem />
          </PrivateRoute>
        ),
      },
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
],
// {future: {
//   v7_relativeSplatPath: true, // Enables relative paths in nested routes
//   v7_fetcherPersist: true,   // Retains fetcher state during navigation
//   v7_normalizeFormMethod: true, // Normalizes form methods (e.g., POST or GET)
//   v7_partialHydration: true, // Supports partial hydration for server-side rendering
//   v7_skipActionErrorRevalidation: true, // Prevents revalidation when action errors occur
// },
// }
);

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <ThemeProvider>
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
    </ThemeProvider>
  </Provider>
);
