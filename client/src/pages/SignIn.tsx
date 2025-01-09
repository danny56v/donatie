import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signInFailure, signInStart, signInSuccess } from "../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { RootState } from "../redux/store";
import axios from "axios";


export default function Example() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const loading = useSelector((state: RootState) => state.user.loading);
  const error = useSelector((state: RootState) => state.user.error);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      dispatch(signInFailure("Toate campurile sunt obligatorii. "));
      return;
    }
    try {
      dispatch(signInStart());
      const res = await axios.post("/api/auth/signin", formData);
      // const res = await fetch("api/auth/signin", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(formData),
      // });

      // const data = await res.json();
      // console.log(res.data.message)
      // if (res.statusText !== "OK") {                      // acest if nu este necesar pentru acxios deoarece axios va arunca o eroare daca statusul nu este 200
      //   dispatch(signInFailure(res.data.message));
      //   return;
      // }
      const {user} = res.data;

      dispatch(signInSuccess(user));
      navigate("/");
    } catch (error) {
      const errorMessage =
        axios.isAxiosError(error) && error.response
          ? error.response.data.message || "A apărut o eroare la autentificare."
          : "A apărut o eroare neprevăzută.";
      dispatch(signInFailure(errorMessage));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Your Company"
            src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form action="#" method="POST" className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  onChange={handleChange}
                  value={formData.email}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                  Password
                </label>
                {/* <div className="text-sm">
                  <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Forgot password?
                  </a>
                </div> */}
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  onChange={handleChange}
                  value={formData.password}
                />
              </div>
              {error && <p className="text-red-600 text-xs text-end">{error}</p>}
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`flex w-full justify-center rounded-md bg-gray-900 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-700
                  ${loading ? "bg-gray-600 hover:bg-gray-600 cursor-not-allowed" : ""}
                  `}
              >
                {loading ? "Loading..." : "Sign in"}
              </button>
            </div>
          </form>
          <p className="mt-10 text-center text-sm/6 text-gray-500">
            {" "}
            <a href="/signup" className="font-semibold text-gray-900 hover:text-gray-600">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
