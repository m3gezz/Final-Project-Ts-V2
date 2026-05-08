// import { refresh } from "@/api/functions";
import { Spinner } from "@/components/ui/spinner";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function General({ children }: { children: React.ReactNode }) {
  //   const { theme } = useSelector((state) => state?.theme);
  //   const disp = useDispatch();
  const isLoading = false;
  //   useEffect(() => {
  //     const html = document.querySelector("html");
  //     if (theme === "dark") {
  //       html?.classList.add("dark");
  //     } else {
  //       html?.classList.remove("dark");
  //     }
  //   }, [theme]);

  //   const { isLoading } = useQuery({
  //     queryKey: ["refresh"],
  //     queryFn: () => refresh(disp),
  //   });

  return (
    <>
      {isLoading ? (
        <Spinner className="absolute top-1/2 left-1/2 -translate-1/2" />
      ) : (
        children
      )}
    </>
  );
}
