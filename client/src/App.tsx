import Layout from "./components/Layout";
import { Route, Routes } from "react-router-dom";
import AllProducts from "./pages/AllProducts";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import PrivateRoute from "./components/PrivateRoute";
import CreateProduct from "./pages/CreateProduct";
import ViewProduct from "./pages/ViewProduct";
import { MyProducts } from "./pages/MyProducts";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<AllProducts />} />
        <Route path="signin" element={<SignIn />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="product/:id" element={<ViewProduct />} />
        <Route path="/" element={<PrivateRoute />}>
          <Route path="product" element={<CreateProduct />} />
          <Route path="my-products" element={<MyProducts />} />
        </Route>

        {/* <Route path="" element={<AllProducts />} /> */}
      </Route>
    </Routes>
  );
};

export default App;
