import { useState } from "react";

import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAppDispatch } from "../../../store/store";
import styles from "./EditUser.module.css";
import { Spinner } from "../../UI/Spinner/Spinner";
import { useForm } from "react-hook-form";
import { Button } from "../../UI/Button/Button";
import { Input } from "../../UI/Input/Input";
import { Actions } from "../../UI/Actions/Actions";
import { Select } from "../../UI/Select/Select";
import { FaSave } from "react-icons/fa";
import { useMutation } from "react-query";
import { server } from "../../../util/axios";
import { Users } from "../../../util/models";
import { errorHandling, messageHandling } from "../../../util/functions";

const Validation = Yup.object().shape({
  names: Yup.string().min(2, "Required"),
  lastName: Yup.string().min(2, "Required"),
  resetPassword: Yup.boolean().required("Select an option"),
  email: Yup.string().email("Must be a valid email").required("Required"),
  password: Yup.string().when("resetPassword", (resetPassword: boolean) => {
    if (resetPassword)
      return Yup.string()
        .min(6, "Password has to at least 6 characters long")
        .required("Give a new passwod");
    return Yup.string().nullable();
  }),
  confirmPassword: Yup.string().when(
    "resetPassword",
    (resetPassword: boolean) => {
      if (resetPassword)
        return Yup.string().oneOf(
          [Yup.ref("password"), null],
          "Must be the same"
        );
      return Yup.string().nullable();
    }
  ),
});

interface IFormLogin {
  names: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  resetPassword: boolean;
}

interface IEditUser {
  user: Users;
  SubmitHandler: (values: IFormLogin) => void;
}

export const EditUser: React.FC<IEditUser> = (props) => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<IFormLogin>({
    resolver: yupResolver(Validation),
    mode: "onBlur",
    defaultValues: {
      email: props.user.email,
      password: "",
      names: props.user.names,
      lastName: props.user.lastName,
      role: props.user.role,
      confirmPassword: "",
      resetPassword: false,
    },
  });
  const resetPassword = watch("resetPassword");

  const options = ["user", "admin"];
  const selectOptions = options.map((key) => ({ text: key, value: key }));

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        {loading ? (
          <Spinner />
        ) : (
          <form
            onSubmit={handleSubmit((values, event) => {
              event?.preventDefault();
              setLoading(true);
              props.SubmitHandler(values);
              setLoading(false);
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
              <Button
                color="secondary"
                type="button"
                onClick={() => setValue("resetPassword", !resetPassword)}
              >
                Reset Password
              </Button>
              {resetPassword ? (
                <div className={styles.passwordWrapper}>
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
                </div>
              ) : (
                false
              )}
              <Actions>
                <Button type="submit" icon={FaSave} inline>
                  Save
                </Button>
              </Actions>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
