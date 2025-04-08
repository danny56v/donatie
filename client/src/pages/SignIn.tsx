import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signInFailure, signInStart, signInSuccess } from "../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { RootState } from "../redux/store";
import axios from "axios";
import { ErrorMessage, Field, FieldGroup, Fieldset, Label } from "../components/catalyst/fieldset";
import { Heading } from "../components/catalyst/heading";
import { Text, TextLink } from "../components/catalyst/text";
import { Input } from "../components/catalyst/input";
import { Button } from "../components/catalyst/button";

export default function SignIn() {
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
      const user = res.data.user;
      console.log(user);
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
      <form action="#" onSubmit={handleSubmit}>
        <div className="flex flex-1 flex-col  justiy-center max-w-md mx-auto px-9 py-12">
          <Fieldset className=" flex flex-col ">
            <Heading className=" text-center">Autentificare</Heading>
            <Text className="text-center"> Completează toate câmpurile.</Text>
            <FieldGroup>
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
                {loading ? "Loading..." : "Autenficare"}
              </Button>
              <Button
                type="button"
                color="light"
                className="w-full mt-4"
                onClick={() => (window.location.href = "http://localhost:3000/api/auth/google")}
              >
                Autentifică-te cu Google
              </Button>
              <div className="text-center flex justify-center space-x-4 ">
                <Text>Nu ai un cont? </Text>
                <TextLink href="/signup" className="text-center">
                  Înregistrare
                </TextLink>
              </div>
              {/* <Button type="submit" color="light" className="w-full">Înregistrare</Button> */}
              <Field>{error && <ErrorMessage>{error}</ErrorMessage>}</Field>
            </FieldGroup>
          </Fieldset>
        </div>
      </form>
    </>
  );
}
