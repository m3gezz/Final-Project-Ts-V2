import type { PopulatedMessage } from "@/assets/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type ReplyType = {
  reply?: PopulatedMessage | null;
};

const initialState: ReplyType = {
  reply: null,
};

const slice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    setReply: (state, action: PayloadAction<{ reply: ReplyType["reply"] }>) => {
      const reply = action.payload.reply;
      state.reply = reply;
    },
  },
});

export const { setReply } = slice.actions;
export default slice.reducer;
