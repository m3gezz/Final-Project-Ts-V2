import Header from "@/components/slices/Header";
import SelectController from "@/components/controllers/SelectController";
import InputController from "@/components/controllers/InputController";
import { useEffect, useState } from "react";
import { getSkills } from "@/api/functions/data";
import { useQueries } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { getUsers } from "@/api/functions/user";
import UserCard from "@/components/cards/UserCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import UsersList from "@/components/lists/UsersList";

export default function Users() {
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    to: 0,
    total: 0,
  });
  const form = useForm({
    defaultValues: {
      search: "",
      skill_id: "0",
      sort: "1",
    },
  });
  const [search, skill_id, sort] = form.watch(["search", "skill_id", "sort"]);

  const [{ data: users, isFetching: isFetchingUsers }, { data: skills }] =
    useQueries({
      queries: [
        {
          queryKey: ["users", pagination.current_page, search, skill_id, sort],

          queryFn: () =>
            getUsers({
              pagination,
              setPagination,
              search,
              skill_id,
              sort,
            }),
        },

        {
          queryKey: ["skills"],
          queryFn: getSkills,
        },
      ],
    });

  useEffect(() => {
    setPagination((prev) => ({ ...prev, current_page: 1 }));
  }, [skill_id, sort]);

  return (
    <div>
      <Header title="Users" description="Find people to collaborate with." />
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
              f={{ name: "skill_id" }}
              options={[
                {
                  id: 0,
                  label: "All",
                },
                ...(skills ?? []),
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
      <UsersList users={users} isLoading={isFetchingUsers} />
      <div className="mt-10 flex justify-center gap-2">
        <Button
          onClick={() => {
            if (pagination?.current_page <= 1) return;
            setPagination((prev) => ({
              ...prev,
              current_page: prev?.current_page - 1,
            }));
          }}
          disabled={pagination?.current_page <= 1 || isFetchingUsers}
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
            pagination?.current_page >= pagination?.last_page || isFetchingUsers
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
