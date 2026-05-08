import { Spinner } from "@/components/ui/spinner";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { router } from "@/router";
import { refresh } from "@/api/apiFunctions";

export default function General() {
  const disp = useDispatch();

  const { isLoading } = useQuery({
    queryKey: ["refresh"],
    queryFn: () => refresh(disp),
  });

  return (
    <>
      {isLoading ? (
        <Spinner className="absolute top-1/2 left-1/2 -translate-1/2" />
      ) : (
        <RouterProvider router={router} />
      )}
    </>
  );
}
