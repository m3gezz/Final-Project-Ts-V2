import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/slices/Header";
import ProjectCard from "@/components/cards/ProjectCard";
import { useQueries } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import InputController from "@/components/controllers/InputController";
import SelectController from "@/components/controllers/SelectController";
import { getProjects } from "@/api/functions/project";
import { getCategories } from "@/api/functions/data";
import ProjectsList from "@/components/lists/ProjectsList";

export default function Projects() {
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    to: 0,
    total: 0,
  });
  const form = useForm({
    defaultValues: {
      search: "",
      category_id: "0",
      sort: "1",
    },
  });
  const [search, category_id, sort] = form.watch([
    "search",
    "category_id",
    "sort",
  ]);

  const [
    { data: projects, isFetching: isFetchingProjects },
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
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="flex w-full lg:max-w-2xl gap-2 ml-auto">
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
                  id: 1,
                  label: "Most liked",
                },
                {
                  id: 2,
                  label: "Newest",
                },
              ]}
            />
          </div>
        </div>
      </div>
      <ProjectsList projects={projects} isLoading={isFetchingProjects} />
      <div className="mt-10 flex justify-center gap-2">
        <Button
          onClick={() => {
            if (pagination?.current_page <= 1) return;
            setPagination((prev) => ({
              ...prev,
              current_page: prev?.current_page - 1,
            }));
          }}
          disabled={pagination?.current_page <= 1 || isFetchingProjects}
          variant={"outline"}
          size="sm"
          className="h-9 w-9 rounded-full p-0"
        >
          <ChevronLeft />
        </Button>
        <Button
          variant={"default"}
          size="sm"
          className="h-9 w-9 rounded-full p-0"
        >
          {pagination?.current_page}
        </Button>
        <Button
          onClick={() => {
            if (pagination?.current_page >= pagination?.last_page) return;
            setPagination((prev) => ({
              ...prev,
              current_page: prev?.current_page + 1,
            }));
          }}
          disabled={
            pagination?.current_page >= pagination?.last_page ||
            isFetchingProjects
          }
          variant={"outline"}
          size="sm"
          className="h-9 w-9 rounded-full p-0"
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
