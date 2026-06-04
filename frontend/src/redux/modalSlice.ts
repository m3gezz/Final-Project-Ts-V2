import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type ModalStateType = {
  isCreateTask: boolean;
  isUpdatePassword: boolean;
  isUpdateComment: boolean;
  isUpdateMessage: boolean;
  isDestroyAccount: boolean;
  isDestroyProject: boolean;
  isCreateInvite: boolean;
  value?: any;
};

const initialState: ModalStateType = {
  isCreateTask: false,
  isUpdatePassword: false,
  isUpdateComment: false,
  isUpdateMessage: false,
  isDestroyAccount: false,
  isDestroyProject: false,
  isCreateInvite: false,
  value: null,
};

const slice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    toggleModal: (
      state,
      action: PayloadAction<{ name: keyof ModalStateType }>,
    ) => {
      const modalName = action.payload.name;
      state[modalName] = !state[modalName];
    },
    setValue: (state, action: PayloadAction<{ value: any }>) => {
      const value = action.payload.value;
      state.value = value;
    },
  },
});

export const { toggleModal, setValue } = slice.actions;
export default slice.reducer;
