import { AxiosError } from "axios";
import { setError, setMessage } from "../store/alertSlice";
import { AppDispatch } from "./../store/store";

export const errorHandling = (
  dispatch: AppDispatch,
  error: any,
  message?: string
) => {
  let errorMessage = message || "Error";
  if (error.message === "timeout") {
    errorMessage = "Hay una falla en la conexión a internet";
  } else if ("response" in error) {
    const tempError: AxiosError<any> = { ...error };
    errorMessage = tempError?.response?.data?.message || "Error";
  } else {
    errorMessage = error.message;
  }

  dispatch(setError(errorMessage));
};

export const messageHandling = (dispatch: AppDispatch, message: string) => {
  dispatch(setMessage(message));
};
