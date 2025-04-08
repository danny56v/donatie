import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/slices/userSlice";
import axios from "axios";

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      // 🔒 Setează token-ul în header global pentru axios
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // 🔁 Opțional: salvezi tokenul în localStorage dacă vrei persistență
      localStorage.setItem("token", token);

      // 🔄 Cere userul curent cu tokenul primit
      const fetchUser = async () => {
        try {
          const res = await axios.get("/api/auth/checkAuth");
          dispatch(signInSuccess(res.data.user));
          navigate("/");
        } catch (err) {
          console.error("Eroare la preluarea utilizatorului după OAuth.");
          navigate("/signin");
        }
      };

      fetchUser();
    } else {
      navigate("/signin");
    }
  }, [dispatch, navigate]);

  return <div>Autentificare reușită! Se redirecționează...</div>;
};

export default OAuthSuccess;
