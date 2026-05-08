import type { User } from "@/data/exp";
import { createSlice } from "@reduxjs/toolkit";

type AuthStateType = {
  user: User | null;
  token: string | null;
};

const initialState: AuthStateType = {
  token: "",
  user: null,
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action) =>
      (state = {
        user: action?.payload?.user ?? state?.user,
        token: action?.payload?.token ?? state?.token,
      }),
    unsetAuth: (state) => (state = initialState),
  },
});

export default slice.reducer;
export const { setAuth, unsetAuth } = slice.actions;
