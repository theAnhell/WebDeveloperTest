import { errorHandling } from "./../util/functions";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { server } from "../util/axios";
import { AppDispatch } from "./store";

interface AuthState {
  token: string | null;
  id: number | null;
  role: string | null;
  completeName: string | null;
  error: string | null;
}

const localStorageActions = {
  token: "token",
  expirationDate: "expirationDate",
  id: "id",
  role: "role",
  completeName: "completeName",
};

export const slice = createSlice({
  name: "auth",
  initialState: {
    token: null,
    error: null,
    id: null,
    completeName: null,
    role: null,
  } as AuthState,
  reducers: {
    signIn: (
      state,
      action: PayloadAction<{
        token: string;
        id: number;
        role: string;
        completeName: string;
      }>
    ) => {
      state.token = action.payload.token;
      state.id = action.payload.id;
      state.role = action.payload.role;
      state.completeName = action.payload.completeName;
      state.error = null;
    },
    logout: (state) => {
      localStorage.removeItem(localStorageActions.expirationDate);
      localStorage.removeItem(localStorageActions.id);
      localStorage.removeItem(localStorageActions.completeName);
      localStorage.removeItem(localStorageActions.role);
      localStorage.removeItem(localStorageActions.token);
      state.token = null;
      state.id = null;
      state.error = null;
      state.role = null;
      state.completeName = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { logout, setError, signIn } = slice.actions;

/* export const checkAuthTimeout = createAsyncThunk(
  "auth/checkAuthTimeout",
  async (expirationTime: number, thunkApi) => {
    setTimeout(() => thunkApi.dispatch(logout()), expirationTime * 1000);
  }
); */

export const checkAuthTimeout = (expirationTime: number) => {
  return async (dispatch: AppDispatch) => {
    setTimeout(() => dispatch(logout()), expirationTime * 1000);
  };
};

const saveStorage = (
  dispatch: AppDispatch,
  expiresIn: number,
  token: string,
  id: number,
  role: string,
  completeName: string
) => {
  const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
  localStorage.setItem(
    localStorageActions.expirationDate,
    expirationDate.toString()
  );
  localStorage.setItem(localStorageActions.id, id.toString());
  localStorage.setItem(localStorageActions.completeName, completeName);
  localStorage.setItem(localStorageActions.role, role);
  localStorage.setItem(localStorageActions.token, token);
  server.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  dispatch(signIn({ token, id, role, completeName }));
  dispatch(checkAuthTimeout(expiresIn));
};

export const register = (
  email: string,
  password: string,
  names: string,
  lastName: string,
  role: string
) => {
  return async (dispatch: AppDispatch) => {
    const authData = {
      email,
      password,
      names,
      lastName,
      role,
    };
    try {
      const response = await server.post("/auth/register", authData);

      saveStorage(
        dispatch,
        response.data.expiresIn,
        response.data.token,
        response.data.id,
        response.data.role,
        response.data.completeName
      );
    } catch (err: any) {
      if (err && "response" in err && err.response && "data" in err.response) {
        dispatch(setError(err.response.data.message));
      } else {
        errorHandling(dispatch, err);
      }
    }
  };
};

export const login = (email: string, password: string) => {
  return async (dispatch: AppDispatch) => {
    const authData = {
      email,
      password,
    };

    try {
      const response = await server.post("/auth/login", authData);

      saveStorage(
        dispatch,
        response.data.expiresIn,
        response.data.token,
        response.data.id,
        response.data.role,
        response.data.completeName
      );
    } catch (err: any) {
      if (err && "response" in err && err.response && "data" in err.response) {
        dispatch(setError(err.response.data.message));
      } else {
        errorHandling(dispatch, err);
      }
    }
  };
};

export const authCheckState = () => {
  return async (dispatch: AppDispatch) => {
    const token = localStorage.getItem(localStorageActions.token);
    if (!token) {
      dispatch(logout());
    } else {
      const tempExpirationTime = localStorage.getItem(
        localStorageActions.expirationDate
      );
      const expirationDate = new Date(tempExpirationTime || "");
      if (expirationDate > new Date()) {
        const id = localStorage.getItem(localStorageActions.id);
        const role = localStorage.getItem(localStorageActions.role);
        const completeName = localStorage.getItem(
          localStorageActions.completeName
        );
        if (id && role && completeName) {
          server.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          dispatch(
            signIn({
              token,
              id: +id,
              role,
              completeName: completeName,
            })
          );
          dispatch(
            checkAuthTimeout(
              (expirationDate.getTime() - new Date().getTime()) / 1000
            )
          );
        } else {
          dispatch(logout());
        }
      } else {
        dispatch(logout());
      }
    }
  };
};

export default slice.reducer;
