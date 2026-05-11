import { setAuth, unsetAuth } from "@/redux/authSlice";
import { api } from "../axios";

const refresh = async (disp) => {
  const res = await api.post("refresh");
  disp(setAuth(res?.data));
  return res;
};

const me = async (disp) => {
  const res = await api.post("me");
  disp(setAuth(res?.data));
  return res;
};

const signIn = async (data, disp) => {
  const res = await api.post("sign-in", data);
  disp(setAuth(res?.data));
  return res;
};

const signUp = async (data, disp) => {
  const res = await api.post("sign-up", data);
  disp(setAuth(res?.data));
  return res;
};

const signOut = async (disp) => {
  const res = await api.post("sign-out");
  disp(unsetAuth());
  return res;
};

export { refresh, me, signIn, signUp, signOut };
