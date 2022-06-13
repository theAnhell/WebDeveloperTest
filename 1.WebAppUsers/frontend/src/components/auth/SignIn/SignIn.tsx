import { useState } from "react";

import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { login, setError } from "../../../store/authSlice";
import styles from "./SignIn.module.css";
import { ErrorMessage } from "../../UI/ErrorMessage/ErrorMessage";
import { Spinner } from "../../UI/Spinner/Spinner";
import { useForm } from "react-hook-form";
import { Button } from "../../UI/Button/Button";
import { Input } from "../../UI/Input/Input";
import { Actions } from "../../UI/Actions/Actions";
import { useNavigate } from "react-router-dom";

const Validation = Yup.object().shape({
  password: Yup.string()
    .min(6, "Password has to at least 6 characters long")
    .required("Required"),
  email: Yup.string().email("Must be a valid email").required("Required"),
});

interface IFormLogin {
  email: string;
  password: string;
}

const SignIn = () => {
  const navigate = useNavigate();
  const { error } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormLogin>({
    resolver: yupResolver(Validation),
    mode: "onBlur",
    defaultValues: { email: "", password: "" },
  });

  let errorMessage = null;

  console.log({ error });
  if (error) {
    errorMessage = <ErrorMessage>{error}</ErrorMessage>;
    setTimeout(() => {
      dispatch(setError(null));
    }, 5000);
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.card_title}>Log-in</h1>

        {loading ? (
          <Spinner />
        ) : (
          <form
            onSubmit={handleSubmit((values, event) => {
              console.log("Am i inside?");
              event?.preventDefault();
              setLoading(true);
              console.log(values);
              dispatch(login(values.email, values.password)).then(() =>
                setLoading(false)
              );
            })}
          >
            <div className={styles.form}>
              <Input
                title="E-mail"
                type="email"
                errors={errors}
                name="email"
                register={register}
              />
              <Input
                title="Password"
                type="password"
                errors={errors}
                name="password"
                register={register}
              />
              <Actions style={{ justifyContent: "space-evenly" }}>
                <Button type="submit">Continuar</Button>
                <Button
                  type="button"
                  color="secondary"
                  onClick={() => navigate("/register")}
                >
                  Go to Register
                </Button>
              </Actions>
            </div>
          </form>
        )}
        {errorMessage}
      </div>
    </div>
  );
};

export default SignIn;
