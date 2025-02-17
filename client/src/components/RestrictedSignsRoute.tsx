import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Navigate, Outlet } from "react-router-dom";

export const RestrictedSignsRoute = () => {
  const user = useSelector((state: RootState) => state.user.isAuthenticated);
  return user ? <Navigate to="/" /> : <Outlet />;
};
