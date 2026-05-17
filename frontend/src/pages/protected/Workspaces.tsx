import { getWorkspaces } from "@/api/functions/workspaces";
import type { PaginationState } from "@/assets/types";
import InputController from "@/components/controllers/InputController";
import SelectController from "@/components/controllers/SelectController";
import WorkspacesList from "@/components/lists/WorkspacesList";
import Header from "@/components/slices/Header";
import PageFooter from "@/components/slices/PageFooter";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function Workspaces() {
  const [pagination, setPagination] = useState<PaginationState>({
    current_page: 1,
    last_page: 1,
    to: 0,
    total: 0,
  });
  const form = useForm({
    defaultValues: {
      search: "",
      status: "on_hold",
      type: "owned",
    },
  });

  const [search, status, type] = form.watch(["search", "status", "type"]);

  const { data: workspaces, isFetching } = useQuery({
    queryKey: ["workspaces", pagination.current_page, search, status, type],
    queryFn: () =>
      getWorkspaces({
        pagination,
        setPagination,
        search,
        status,
        type,
      }),
  });

  useEffect(() => {
    setPagination((prev) => ({ ...prev, current_page: 1 }));
  }, [status, type]);

  return (
    <div>
      <Header
        title="Workspaces"
        description="Private spaces where your teams collaborate."
      />

      <div className="mb-6 flex w-full lg:max-w-2xl gap-2 ml-auto">
        <InputController
          control={form.control}
          f={{
            name: "search",
            placeholder: "Search projects…",
          }}
        />
        <div className="flex gap-2">
          <SelectController
            control={form.control}
            f={{ name: "status" }}
            options={[
              {
                id: "on_hold",
                label: "On Hold",
              },
              {
                id: "active",
                label: "Active",
              },
            ]}
          />
          <SelectController
            control={form.control}
            f={{ name: "type" }}
            options={[
              {
                id: "owned",
                label: "Owned",
              },
              {
                id: "worked",
                label: "Worked",
              },
            ]}
          />
        </div>
      </div>

      <WorkspacesList workspaces={workspaces} isLoading={isFetching} />
      {!isFetching && (
        <PageFooter
          pagination={pagination}
          setPagination={setPagination}
          isLoading={isFetching}
        />
      )}
    </div>
  );
}
