import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { signInFailure, signInStart, signInSuccess } from "../redux/slices/userSlice";

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const checkGoogleAuth = async () => {
      try {
        dispatch(signInStart());
        const res = await axios.get("/api/auth/checkAuth");
        if (res.data.isAuthenticated) {
          dispatch(signInSuccess(res.data.user));
        } else {
          dispatch(signInFailure("Autentificarea a eșuat."));
        }
        navigate("/");
      } catch (error) {
        dispatch(signInFailure("Eroare la autentificare cu Google."));
        navigate("/signin");
      }
    };

    checkGoogleAuth();
  }, [dispatch, navigate]);

  return <div>Autentificare reușită! Se redirecționează...</div>;
};

export default OAuthSuccess;
