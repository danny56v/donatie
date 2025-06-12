import { useDispatch, useSelector } from "react-redux";
import { Outlet, Navigate, useNavigate } from "react-router-dom";
import { RootState } from "../redux/store";
import { useEffect, useState } from "react";
import axios from "axios";
import { signInFailure, signInStart, signInSuccess, signOutSuccess } from "../redux/slices/userSlice";
import { toast } from "react-toastify";


export default function PrivateRoute() {
  const { isAuthenticated, isBlocked} = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        dispatch(signInStart());
        const res = await axios.get("/api/auth/checkAuth");
          console.log(res.data.user);
        if (res.data.isAuthenticated) {
          dispatch(signInSuccess(res.data.user));
        } else {
          dispatch(signInFailure());
        }
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 403) {
          await axios.post("/api/auth/signout");
          dispatch(signOutSuccess());
          navigate("/signin");
          toast.error("Contul tău este blocat de către administrator.");
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [dispatch, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated && isBlocked === false ? <Outlet /> : <Navigate to="/signin" />;
}
