import Layout from "./components/Layout";
import { Route, Routes } from "react-router-dom";
import AllProducts from "./pages/AllProducts";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import PrivateRoute from "./components/PrivateRoute";
import ViewProduct from "./pages/ViewProduct";
import { MyProducts } from "./pages/MyProducts";
import { EditProduct } from "./pages/EditProduct";
import { CreateProduct } from "./pages/CreateProduct";
import { RestrictedSignsRoute } from "./components/RestrictedSignsRoute";
import { Profile } from "./pages/Profile";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<AllProducts />} />
        <Route path="product/:id" element={<ViewProduct />} />

        <Route path="/" element={<RestrictedSignsRoute />}>
          <Route path="signin" element={<SignIn />} />
          <Route path="signup" element={<SignUp />} />
        </Route>
        <Route path="/" element={<PrivateRoute />}>
          <Route path="product/new" element={<CreateProduct />} />
          <Route path="my-profile" element={<Profile />} />
          <Route path="product/edit/:id" element={<EditProduct />} />
          <Route path="my-products" element={<MyProducts />} />
        </Route>

        {/* <Route path="" element={<AllProducts />} /> */}
      </Route>
    </Routes>
  );
};

export default App;
