import { store } from "@/redux/store";
import Echo from "laravel-echo";
import Pusher from "pusher-js";

declare global {
  interface Window {
    Pusher: typeof Pusher;
  }
}

window.Pusher = Pusher;

const echo = new Echo({
  broadcaster: "reverb",
  key: "ux28spdz7jpctot2wyxp",
  wsHost: "127.0.0.1",
  wsPort: 8080,
  forceTLS: false,
  enabledTransports: ["ws"],

  authEndpoint: "http://127.0.0.1:8000/api/broadcasting/auth",

  auth: {
    headers: {
      get Authorization() {
        const token = store.getState()?.auth?.token;
        return token ? `Bearer ${token}` : "";
      },
      Accept: "application/json",
    },
  },
});

export default echo;
