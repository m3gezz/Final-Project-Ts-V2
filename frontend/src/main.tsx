import { createRoot } from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import General from "./layouts/General";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,

      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
    },
    mutations: {
      onError: () => {
        toast.error("Something went wrong.");
      },
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <General />
      <Toaster richColors />
    </Provider>
  </QueryClientProvider>,
);
