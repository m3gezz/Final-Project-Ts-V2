import { createRoot } from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import General from "./layouts/General";
import { Provider } from "react-redux";
import { store } from "@/redux/store";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { gcTime: 1000 * 60 * 2, staleTime: 1000 * 60 },
  },
});

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <General />
    </Provider>
  </QueryClientProvider>,
);
