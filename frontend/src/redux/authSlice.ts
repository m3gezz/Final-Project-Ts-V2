import type { PopulatedUser } from "@/assets/types";
import { createSlice } from "@reduxjs/toolkit";

type AuthStateType = {
  user: PopulatedUser | null;
  token: string | null;
};

const initialState: AuthStateType = {
  token: null,
  user: null,
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      if (action.payload?.user !== undefined) {
        state.user = action.payload.user;
      }
      if (action.payload?.token !== undefined) {
        state.token = action.payload.token;
      }
    },
    unsetAuth: () => initialState,
  },
});

export default slice.reducer;
export const { setAuth, unsetAuth } = slice.actions;
