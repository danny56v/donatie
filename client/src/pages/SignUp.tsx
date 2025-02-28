import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signUpFailure, signUpStart, signUpSuccess } from "../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { RootState } from "../redux/store";
import axios from "axios";
import { ErrorMessage, Field, FieldGroup, Fieldset, Label, Legend } from "../components/catalyst/fieldset";
import { Heading } from "../components/catalyst/heading";
import { Text, TextLink } from "../components/catalyst/text";
import { Input } from "../components/catalyst/input";
import { Button } from "../components/catalyst/button";

export default function SignUp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });

  const loading = useSelector((state: RootState) => state.user.loading);
  const error = useSelector((state: RootState) => state.user.error);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.username) {
      dispatch(signUpFailure("Toate campurile sunt obligatorii. "));
      return;
    }
    try {
      dispatch(signUpStart());
      console.log(formData);
      const res = await axios.post("/api/auth/signup", formData);
      // const res = await fetch("api/auth/signup", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(formData),
      // });

      // const data = await res.json();
      // console.log(res);

      // if (!res.data) {
      //   dispatch(signUpFailure(res.data.message || "Eroare la autentificare"));
      //   return;
      // }
      // console.log(res)
      dispatch(signUpSuccess());
      navigate("/signin");
    } catch (error) {
      const errorMessage =
        axios.isAxiosError(error) && error.response
          ? error.response.data.message || "A apărut o eroare la autentificare."
          : "A apărut o eroare neprevăzută.";
      dispatch(signUpFailure(errorMessage));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  return (
    <>
      <form action="#" onSubmit={handleSubmit}>
        <div className="flex flex-1 flex-col  justiy-center max-w-md mx-auto px-9 py-5">
          <Fieldset className=" flex flex-col ">
            <Heading className=" text-center">Înregistrare</Heading>
            <Text className="text-center"> Completează toate câmpurile.</Text>
            <FieldGroup>
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-4">
                <Field>
                  <Label>Prenume</Label>
                  <Input
                    name="firstName"
                    required
                    type="text"
                    placeholder="Ion"
                    invalid={Boolean(error)}
                    onChange={handleChange}
                    value={formData.firstName}
                  />
                </Field>
                <Field>
                  <Label>Nume</Label>
                  <Input
                    name="lastName"
                    type="text"
                    required
                    placeholder="Chirtoaca"
                    invalid={Boolean(error)}
                    onChange={handleChange}
                    value={formData.lastName}
                  />
                </Field>
              </div>
              <Field>
                <Label htmlFor="username">Username</Label>
                <Input
                  name="username"
                  id="username"
                  type="text"
                  invalid={Boolean(error)}
                  required
                  autoComplete="username"
                  onChange={handleChange}
                  value={formData.username}
                  placeholder="ion212"
                ></Input>
              </Field>
              <Field>
                <Label htmlFor="email">Email</Label>
                <Input
                  name="email"
                  id="email"
                  type="email"
                  invalid={Boolean(error)}
                  required
                  autoComplete="email"
                  onChange={handleChange}
                  value={formData.email}
                  placeholder="ion@gmail.com"
                ></Input>
              </Field>
              <Field>
                <Label htmlFor="password">Parola</Label>
                <Input
                  name="password"
                  id="password"
                  type="password"
                  invalid={Boolean(error)}
                  required
                  autoComplete="current-password"
                  onChange={handleChange}
                  value={formData.password}
                  placeholder="********"
                ></Input>
              </Field>

              <Button type="submit" disabled={loading} className="w-full cursor-pointer">
                {loading ? "Loading..." : "Înregistrare"}
              </Button>
              <div className="text-center flex justify-center space-x-4 ">
                <Text>Ai deja un cont existent? </Text>
                <TextLink href="/signin" className="text-center">
                  Loghează-te
                </TextLink>
              </div>
              <Field>{error && <ErrorMessage>{error}</ErrorMessage>}</Field>
              {/* <Button type="submit" color="light" className="w-full">Înregistrare</Button> */}
              {/* {error && <ErrorMessage>{error}</ErrorMessage>} */}
            </FieldGroup>
          </Fieldset>
        </div>
      </form>
      {/* <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Your Company"
            src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Sign Up</h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form action="#" method="POST" className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">
                Username
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  autoComplete="username"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  onChange={handleChange}
                  value={formData.username}
                />
              </div>
            </div>

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
                </div> //////
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
                {loading ? "Loading..." : "Sign Up"}
              </button>
            </div>
          </form>
          <p className="mt-10 text-center text-sm/6 text-gray-500">
            {"Have an account?   "}
            <a href="/signin" className="font-semibold text-gray-900 hover:text-gray-600">
              Sign In
            </a>
          </p>
        </div>
      </div> */}
    </>
  );
}
