import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Navigate, Outlet } from "react-router-dom";

export const AdminRoute = () => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);

if(!currentUser) {
    return <Navigate to="/signin" />; 
}
  const admin = currentUser.isAdmin
  console.log(admin);
  console.log(currentUser);
  return admin ? <Outlet /> : <Navigate to="/" />;
};   