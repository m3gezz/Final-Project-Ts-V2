import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Sparkles, Award, Tag } from "lucide-react";
import ErrorCard from "@/components/cards/ErrorCard";
import Header from "@/components/slices/Header";
import { useAppSelector } from "@/redux/store";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import {
  createData,
  deleteData,
  getBadges,
  getCategories,
  getSkills,
} from "@/api/functions/data";
import { useForm } from "react-hook-form";
import type { DataType, DefaultFields } from "@/assets/types";
import InputController from "@/components/controllers/InputController";
import TextareaController from "@/components/controllers/TextareaController";
import { handleApiErrors } from "@/api/functions/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { getCreateDataSchema, type createDataSchemaType } from "@/zod/data";
import { Skeleton } from "@/components/ui/skeleton";

export default function Populate() {
  const { user } = useAppSelector((state) => state?.auth);
  const [
    { data: skills, isLoading: isSkillsLoading },
    { data: categories, isLoading: isCategoriesLoading },
    { data: badges, isLoading: isBadgesLoading },
  ] = useQueries({
    queries: [
      {
        queryKey: ["skills"],
        queryFn: getSkills,
      },
      {
        queryKey: ["categories"],
        queryFn: getCategories,
      },
      {
        queryKey: ["badges"],
        queryFn: getBadges,
      },
    ],
  });

  if (!user?.admin)
    return (
      <ErrorCard description="Only admins can access the populate page." />
    );

  return (
    <div className="space-y-8">
      <Header
        title="Populate"
        description="Seed and manage the global vocabulary used across Collab — skills, badges and project categories."
      />

      <Tabs defaultValue="skills" className="flex flex-col">
        <TabsList>
          <TabsTrigger value="skills">
            <Sparkles className="mr-2 h-4 w-4" />
            Skills
          </TabsTrigger>
          <TabsTrigger value="categories">
            <Tag className="mr-2 h-4 w-4" />
            Categories
          </TabsTrigger>
          <TabsTrigger value="badges">
            <Award className="mr-2 h-4 w-4" />
            Badges
          </TabsTrigger>
        </TabsList>

        <TabsContent value="skills" className="mt-6">
          <ManagerPanel
            title="Skills"
            items={skills}
            isLoading={isSkillsLoading}
          />
        </TabsContent>
        <TabsContent value="categories" className="mt-6">
          <ManagerPanel
            title="Categories"
            items={categories}
            isLoading={isCategoriesLoading}
          />
        </TabsContent>
        <TabsContent value="badges" className="mt-6">
          <ManagerPanel
            title="Badges"
            items={badges}
            withDescription
            isLoading={isBadgesLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ManagerPanel({
  title,
  items,
  withDescription,
  isLoading,
}: {
  title: string;
  items: DataType[];
  withDescription?: boolean;
  isLoading: boolean;
}) {
  const form = useForm<createDataSchemaType>({
    defaultValues: {
      label: "",
      description: "",
    },
    resolver: zodResolver(getCreateDataSchema(title)),
  });

  const queryClient = useQueryClient();
  const { mutate: deleteDataMutation, isPending: isDeleteDataPending } =
    useMutation({
      mutationFn: (id: DefaultFields["id"]) =>
        deleteData(`${title?.toLocaleLowerCase()}/${id}`),
      onMutate: (id) => {
        queryClient.cancelQueries();
        const previous = queryClient.getQueryData([title?.toLowerCase()]);
        queryClient.setQueryData([title?.toLowerCase()], (old: DataType[]) => [
          ...old.filter((i) => i?.id != id),
        ]);
        return { previous };
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [title?.toLowerCase()] });
      },
    });

  const { mutate: createDataMutation, isPending: isCreateDataPending } =
    useMutation({
      mutationFn: (data: createDataSchemaType) =>
        createData(title?.toLocaleLowerCase(), data),
      onMutate: (data) => {
        queryClient.cancelQueries();
        form.reset();

        const previous = queryClient.getQueryData([title?.toLowerCase()]);
        queryClient.setQueryData([title?.toLowerCase()], (old: DataType[]) => [
          {
            id: Date.now(),
            label: data?.label,
            description: data?.description,
          },
          ...old,
        ]);
        return { previous };
      },
      onError: (err) => {
        handleApiErrors(err, form);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [title?.toLowerCase()] });
      },
    });

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr,1.2fr]">
      <div className="p-5">
        <h2 className="text-sm font-semibold">Add {title}</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Items appear instantly in the list and become selectable across the
          platform.
        </p>
        <form
          onSubmit={form.handleSubmit((data) => createDataMutation(data))}
          className="mt-4 space-y-4"
        >
          <InputController
            control={form.control}
            f={{
              name: "label",
              label: "Label",
              placeholder: "Name the resource.",
            }}
          />
          {withDescription && (
            <TextareaController
              control={form.control}
              f={{
                name: "description",
                label: "Description",
                placeholder: "Shown to users when they earn this badge.",
              }}
            />
          )}
          <Button
            type="submit"
            className="w-full"
            disabled={isCreateDataPending}
          >
            <Plus className="mr-2 h-4 w-4" /> Add{" "}
            {title?.toLowerCase()?.slice(0, -1)}
          </Button>
        </form>
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">{title}</h2>
          <Badge variant="secondary">{items?.length ?? 0}</Badge>
        </div>

        <div className="mt-4 space-y-2">
          {isLoading ? (
            <div className="flex items-start justify-between gap-3 rounded-lg border p-3">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-3 w-25" />
                {withDescription && <Skeleton className="h-2.5 w-30" />}
              </div>
              <Skeleton className="h-6 w-4" />
            </div>
          ) : items?.length ? (
            items?.map((it) => (
              <div
                key={it?.id}
                className="flex items-start justify-between gap-3 rounded-lg border bg-card/50 p-3"
              >
                <div className="min-w-0">
                  <div className="text-sm font-medium">{it?.label}</div>
                  {it?.description && (
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      {it?.description}
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={isDeleteDataPending}
                  onClick={() => deleteDataMutation(it?.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          ) : (
            <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
              No {title?.toLowerCase()} yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
