import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/slices/Header";
import { useQueries } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import InputController from "@/components/controllers/InputController";
import SelectController from "@/components/controllers/SelectController";
import { getProjects } from "@/api/functions/projects";
import { getCategories } from "@/api/functions/data";
import ProjectsList from "@/components/lists/ProjectsList";
import PageFooter from "@/components/slices/PageFooter";
import type { PaginationState } from "@/assets/types";

export default function Projects() {
  const [pagination, setPagination] = useState<PaginationState>({
    current_page: 1,
    last_page: 1,
    to: 0,
    total: 0,
  });
  const form = useForm({
    defaultValues: {
      search: "",
      category_id: "0",
      sort: "likes",
    },
  });
  const [search, category_id, sort] = form.watch([
    "search",
    "category_id",
    "sort",
  ]);

  const [
    { data: projects, isFetching: isProjectsFetching },
    { data: categories },
  ] = useQueries({
    queries: [
      {
        queryKey: [
          "projects",
          pagination.current_page,
          search,
          category_id,
          sort,
        ],

        queryFn: () =>
          getProjects({
            pagination,
            setPagination,
            search,
            category_id,
            sort,
          }),
      },

      {
        queryKey: ["categories"],
        queryFn: getCategories,
      },
    ],
  });

  useEffect(() => {
    setPagination((prev) => ({ ...prev, current_page: 1 }));
  }, [category_id, sort]);

  return (
    <div>
      <Header
        title="Projects"
        description="Discover ideas from the community and find your next collaboration."
        action={
          <Button asChild>
            <Link to="/create-project">
              <Plus className="mr-2 h-4 w-4" />
              New project
            </Link>
          </Button>
        }
      />

      <div className="mb-6 flex flex-col w-full lg:max-w-2xl lg:flex-row gap-2 ml-auto">
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
            f={{ name: "category_id" }}
            options={[
              {
                id: 0,
                label: "All",
              },
              ...(categories ?? []),
            ]}
          />
          <SelectController
            control={form.control}
            f={{ name: "sort" }}
            options={[
              {
                id: "likes",
                label: "Most liked",
              },
              {
                id: "date",
                label: "Newest",
              },
            ]}
          />
        </div>
      </div>

      <ProjectsList projects={projects} isLoading={isProjectsFetching} />

      {!!projects?.length && (
        <PageFooter
          pagination={pagination}
          setPagination={setPagination}
          isLoading={isProjectsFetching}
        />
      )}
    </div>
  );
}
