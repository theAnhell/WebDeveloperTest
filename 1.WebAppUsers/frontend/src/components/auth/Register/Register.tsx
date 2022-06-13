import { useState } from "react";

import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import {
  register as registerHandler,
  setError,
} from "../../../store/authSlice";
import styles from "./Register.module.css";
import { ErrorMessage } from "../../UI/ErrorMessage/ErrorMessage";
import { Spinner } from "../../UI/Spinner/Spinner";
import { useForm } from "react-hook-form";
import { Button } from "../../UI/Button/Button";
import { Input } from "../../UI/Input/Input";
import { Actions } from "../../UI/Actions/Actions";
import { useNavigate } from "react-router-dom";
import { Select } from "../../UI/Select/Select";
import { FaSave } from "react-icons/fa";

const Validation = Yup.object().shape({
  names: Yup.string().min(2, "Required"),
  lastName: Yup.string().min(2, "Required"),
  password: Yup.string()
    .min(6, "Password has to at least 6 characters long")
    .required("Required"),
  email: Yup.string().email("Must be a valid email").required("Required"),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref("password"), null],
    "Must be the same"
  ),
});

interface IFormLogin {
  names: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  confirmPassword: string;
}

const Register = () => {
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
    defaultValues: {
      email: "",
      password: "",
      names: "",
      lastName: "",
      role: "user",
      confirmPassword: "",
    },
  });

  let errorMessage = null;
  if (error) {
    errorMessage = <ErrorMessage>{error}</ErrorMessage>;
    setTimeout(() => {
      dispatch(setError(null));

      setLoading(false);
    }, 3000);
  }

  const options = ["user", "admin"];
  const selectOptions = options.map((key) => ({ text: key, value: key }));

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.card_title}>Register</h1>

        {loading ? (
          <Spinner />
        ) : (
          <form
            onSubmit={handleSubmit((values, event) => {
              event?.preventDefault();
              setLoading(true);
              dispatch(
                registerHandler(
                  values.email,
                  values.password,
                  values.names,
                  values.lastName,
                  values.role
                )
              );
            })}
          >
            <div className={styles.form}>
              <div className={styles.form___names}>
                <Input
                  title="Name(s)"
                  errors={errors}
                  name="names"
                  register={register}
                />
                <Input
                  title="Last Name"
                  errors={errors}
                  name="lastName"
                  register={register}
                />
                <Select
                  title="Role"
                  errors={errors}
                  name="role"
                  register={register}
                  options={selectOptions}
                />
              </div>
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
              <Input
                title="Confirm Password"
                type="password"
                errors={errors}
                register={register}
                name="confirmPassword"
              />
              <Actions>
                <Button type="submit" icon={FaSave} inline>
                  Save
                </Button>
                <Button
                  type="button"
                  color="secondary"
                  onClick={() => navigate("/login")}
                >
                  Change to Log-in
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

export default Register;
