import { Spinner } from "@/components/ui/spinner";
import { useQuery } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { router } from "@/router";
import { refreshToken } from "@/api/functions/auth";
import { useAppDispatch } from "@/redux/store";

export default function General() {
  const disp = useAppDispatch();

  const { isLoading: isRefreshTokenLoading } = useQuery({
    queryKey: ["refreshToken"],
    queryFn: () => refreshToken(disp),
    retry: 0,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  return isRefreshTokenLoading ? (
    <Spinner className="absolute top-1/2 left-1/2 -translate-1/2" />
  ) : (
    <RouterProvider router={router} />
  );
}
