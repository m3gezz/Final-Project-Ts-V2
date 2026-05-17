import { setAuth, unsetAuth } from "@/redux/authSlice";
import { api } from "../axios";
import type { AppDispatch } from "@/redux/store";
import type { signInSchemaType, signUpSchemaType } from "@/zod/authSchemas";

const refreshToken = async (disp: AppDispatch) => {
  const res = await api.post("refreshToken");
  disp(setAuth(res?.data));
  return res;
};

const getMe = async (disp: AppDispatch) => {
  const res = await api.post("getMe");
  disp(setAuth(res?.data));
  return res;
};

const signUp = async (data: signUpSchemaType, disp: AppDispatch) => {
  const res = await api.post("sign-up", data);
  disp(setAuth(res?.data));
  return res;
};

const signIn = async (data: signInSchemaType, disp: AppDispatch) => {
  const res = await api.post("sign-in", data);
  disp(setAuth(res?.data));
  return res;
};

const signOut = async (disp: AppDispatch) => {
  const res = await api.post("sign-out");
  disp(unsetAuth());
  return res;
};

export { refreshToken, getMe, signUp, signIn, signOut };
