import { createSlice } from "@reduxjs/toolkit";

type modalStateType = {
  open: boolean | undefined;
};

const initialState: modalStateType = {
  open: false,
};

const slice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    toggleModal: (state, action) => {
      state.open = action.payload;
    },
  },
});

export default slice.reducer;
export const { toggleModal } = slice.actions;
