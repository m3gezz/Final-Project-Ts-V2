import { setAuth, unsetAuth } from "@/redux/authSlice";
import { api } from "../axios";
import type { AppDispatch } from "@/redux/store";
import type {
  forgotPasswordSchemaType,
  resetPasswordSchemaType,
  signInSchemaType,
  signUpSchemaType,
  verificationCodeSchemaType,
} from "@/zod/authSchemas";
import { toast } from "sonner";

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
  toast.success(res?.data?.message);
  return res;
};

const signIn = async (data: signInSchemaType, disp: AppDispatch) => {
  const res = await api.post("sign-in", data);
  disp(setAuth(res?.data));
  toast.success(res?.data?.message);
  return res;
};

const signOut = async (disp: AppDispatch) => {
  const res = await api.post("sign-out");
  disp(unsetAuth());
  toast.success(res?.data?.message);
  return res;
};

const verifyEmailCode = async (
  data: verificationCodeSchemaType,
  disp: AppDispatch,
) => {
  const res = await api.post("email/verify-code", data);
  disp(setAuth(res?.data));
  toast.success(res?.data?.message);
  return res;
};

const resendEmailVerificationCode = async (disp: AppDispatch) => {
  const res = await api.post("/email/resend-code");
  disp(setAuth(res?.data));
  toast.success(res?.data?.message);
  return res;
};

const verifyResetCode = async (
  data: verificationCodeSchemaType & { email: string | null },
) => {
  const res = await api.post("/password/verify-code", data);
  toast.success(res?.data?.message);
  return res;
};

const sendPasswordResetCode = async (data: forgotPasswordSchemaType) => {
  const res = await api.post("/password/send-code", data);
  toast.success(res?.data?.message);
  return res;
};

const resetUserPassword = async (
  data: resetPasswordSchemaType & { email: string | null; code: string | null },
  disp: AppDispatch,
) => {
  const res = await api.post("/password/reset-password", data);
  disp(setAuth(res?.data));
  toast.success(res?.data?.message);
  return res;
};

export {
  refreshToken,
  getMe,
  signUp,
  signIn,
  signOut,
  verifyEmailCode,
  resendEmailVerificationCode,
  verifyResetCode,
  sendPasswordResetCode,
  resetUserPassword,
};
