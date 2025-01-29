import { useDispatch, useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
import { RootState } from "../redux/store";
import { useEffect, useState } from "react";
import axios from "axios";
import { signInFailure, signInStart, signInSuccess } from "../redux/slices/userSlice";

export default function PrivateRoute() {
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        dispatch(signInStart());
        const res = await axios.get("/api/auth/checkAuth");

        if (res.data.isAuthenticated) {
          dispatch(signInSuccess(res.data.user));
        } else {
          dispatch(signInFailure());
        }
      } catch (error) {
        const errorMessage =
          axios.isAxiosError(error) && error.response
            ? error.response.data.message || "A apărut o eroare la autentificare."
            : "A apărut o eroare neprevăzută.";
        console.log(errorMessage);
        dispatch(signInFailure(errorMessage));
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/signin" />;
}
