import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AlertState {
  message: string | null;
  error: string | null;
}

export const slice = createSlice({
  name: "alert",
  initialState: {
    message: null,
    error: null,
  } as AlertState,
  reducers: {
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    setMessage: (state, action: PayloadAction<string>) => {
      state.message = action.payload;
    },
    clearState: (state) => {
      state.error = null;
      state.message = null;
    },
  },
});

export const { setMessage, setError, clearState } = slice.actions;

export default slice.reducer;
