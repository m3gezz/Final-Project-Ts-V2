import Header from "@/components/slices/Header";
import SelectController from "@/components/controllers/SelectController";
import InputController from "@/components/controllers/InputController";
import { useEffect, useState } from "react";
import { getSkills } from "@/api/functions/data";
import { useQueries } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { getUsers } from "@/api/functions/users";
import UsersList from "@/components/lists/UsersList";
import PageFooter from "@/components/slices/PageFooter";

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
      sort: "likes",
    },
  });
  const [search, skill_id, sort] = form.watch(["search", "skill_id", "sort"]);

  const [{ data: users, isFetching: isUsersFetching }, { data: skills }] =
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
          queryFn: () => getSkills(),
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
        <div className="flex flex-col w-full lg:max-w-2xl lg:flex-row gap-2 ml-auto">
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
      </div>
      <UsersList users={users} isLoading={isUsersFetching} />

      {!!users?.length && (
        <PageFooter
          pagination={pagination}
          setPagination={setPagination}
          isLoading={isUsersFetching}
        />
      )}
    </div>
  );
}
