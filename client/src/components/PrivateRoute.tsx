import { useDispatch, useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
import { RootState } from "../redux/store";
import { useEffect, useState } from "react";
import axios from "axios";
import { signInFailure, signInStart, signInSuccess } from "../redux/slices/userSlice";

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  // Stare locală pentru a urmări procesul de încărcare
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated) {
        setLoading(false); // Evităm apelul API dacă utilizatorul este deja autentificat
        return;
      }
      try {
        dispatch(signInStart());
        const res = await axios.get("/api/auth/checkAuth");
        if (res.data.isAuthenticated) {
          dispatch(signInSuccess(res.data.user));
        }
        // if (!res.data.isAuthenticated) {
        //   // dispatch(signInFailure());
        //   // console.log("Nu e autentificat");
        // }
        dispatch(signInFailure());
      } catch (error) {
        setLoading(false);
        const errorMessage =
          axios.isAxiosError(error) && error.response
            ? error.response.data.message || "A apărut o eroare la autentificare."
            : "A apărut o eroare neprevăzută.";
        console.log(errorMessage);
        dispatch(signInFailure(errorMessage));
      } 
      finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [dispatch, isAuthenticated]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/signin" />;
}
