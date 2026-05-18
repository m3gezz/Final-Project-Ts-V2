import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, TriangleAlert, Lock } from "lucide-react";
import Header from "@/components/slices/Header";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Controller, useForm } from "react-hook-form";
import InputController from "@/components/controllers/InputController";
import SkillsController from "@/components/controllers/SkillsController";
import TextareaController from "@/components/controllers/TextareaController";
import SelectController from "@/components/controllers/SelectController";
import { Checkbox } from "@/components/ui/checkbox";
import DeleteProjectModal from "@/components/modals/DeleteProjectModal";
import { Spinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  canEdit,
  createProject,
  updateProject,
} from "@/api/functions/projects";
import { getCategories } from "@/api/functions/data";
import { getImageUrl } from "@/lib/utils";
import ErrorCard from "@/components/cards/ErrorCard";
import {
  manipulateProjectSchema,
  type manipulateProjectSchemaType,
} from "@/zod/projectsSchemas";
import type { DataType } from "@/assets/types";
import { handleApiErrors } from "@/api/functions/validation";

const textareaFields = [
  {
    name: "description",
    label: "Description",
  },
  {
    name: "manifesto",
    label: "Manifesto",
  },
] as const;

export default function ProjectManipulator({
  mode,
}: {
  mode: "create" | "edit";
}) {
  const nav = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [skills, setSkills] = useState<DataType[]>([]);
  const [preview, setPreview] = useState<string | undefined>(undefined);
  const [
    {
      data: project,
      isError: isProjectError,
      isLoading: isProjectLoading,
      isSuccess: isProjectSuccess,
    },
    { data: categories },
  ] = useQueries({
    queries: [
      {
        queryKey: ["project-check", id],
        queryFn: () => canEdit(id),
        retry: 0,
        enabled: mode === "edit",
      },
      {
        queryKey: ["categories"],
        queryFn: getCategories,
      },
    ],
  });

  const form = useForm<manipulateProjectSchemaType>({
    defaultValues: {
      image: null,
      title: "",
      description: "",
      category_id: "1",
      skills: "",
      manifesto: "",
      private: false,
    },
    resolver: zodResolver(manipulateProjectSchema),
  });

  useEffect(() => {
    if (!isProjectSuccess || !project) return;
    setSkills(project?.skills ?? []);
    setPreview(getImageUrl(project?.image));
    form.reset({
      image: null,
      title: project?.title ?? "",
      description: project?.description ?? "",
      category_id: String(project?.category_id) ?? "1",
      skills: "",
      manifesto: project?.manifesto ?? "",
      private: !!Number(project?.private),
    });
  }, [isProjectSuccess, mode]);

  const {
    mutate: manipulateProjectMutation,
    isPending: isManipulateProjectPending,
  } = useMutation({
    mutationFn: (data: manipulateProjectSchemaType) => {
      const formData = new FormData();

      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("manifesto", data.manifesto);
      formData.append("category_id", String(data.category_id));
      formData.append("private", data.private ? "1" : "0");

      skills.forEach((s) => {
        formData.append("skills[]", String(s.id));
      });

      if (data.image instanceof File) {
        formData.append("image", data.image);
      }

      if (mode === "edit") {
        formData.append("_method", "PATCH");
        return updateProject(id, formData);
      }
      return createProject(formData);
    },
    onError: (err) => {
      handleApiErrors(err, form);
    },
    onSuccess: (data) => {
      if (mode === "edit") {
        queryClient.invalidateQueries({
          queryKey: ["project", String(id)],
        });
        queryClient.invalidateQueries({
          queryKey: ["project-check", String(id)],
        });
        nav(-1);
        return;
      }
      nav(`/projects/${data?.data}`);
    },
  });

  if (isProjectLoading && mode === "edit")
    return (
      <div className="w-fit mx-auto my-40">
        <Spinner />
      </div>
    );

  if (isProjectError && mode === "edit") return <ErrorCard />;

  return (
    <div className="mx-auto max-w-3xl">
      <Header
        title={mode === "create" ? "Create a project" : "Edit project"}
        description="Tell the community what you're building and the team you need."
      />
      <form
        onSubmit={form.handleSubmit((data) => manipulateProjectMutation(data))}
        className="space-y-6 rounded-xl border bg-card p-6"
        style={{ boxShadow: "var(--shadow-soft)" }}
      >
        <div className="space-y-2">
          <Label>Cover image</Label>
          <label className="relative aspect-video flex  w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-dashed ">
            {preview && (
              <img
                src={preview}
                alt=""
                className="h-full w-full object-cover"
              />
            )}

            <div
              className={`absolute z-10 flex flex-col items-center justify-center gap-2  ${preview ? "hover:bg-muted/80 hover:text-muted-foreground text-transparent bg-transparent" : "bg-muted/80 text-muted-foreground"} w-full h-full transition-all`}
            >
              <Upload className="h-6 w-6" />
              <span className="text-sm">Click to upload an image</span>
            </div>

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) {
                  form.setValue("image", f);
                  setPreview(URL.createObjectURL(f));
                }
              }}
            />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <InputController
            control={form.control}
            f={{
              name: "title",
              type: "text",
              label: "Title",
              placeholder: "",
            }}
          />

          <SelectController
            control={form.control}
            f={{
              name: "category_id",
              label: "Category",
            }}
            options={categories}
          />
        </div>

        <SkillsController form={form} skills={skills} setSkills={setSkills} />
        <div className="grid gap-4 md:grid-cols-2">
          {textareaFields?.map((f, i) => (
            <TextareaController key={i} control={form.control} f={f} />
          ))}
        </div>

        <section>
          <h1 className="mb-2 font-semibold">PRIVACY & SECURITY</h1>
          <div className="grid gap-4 md:grid-cols-2">
            <Controller
              control={form.control}
              name="private"
              render={({ field }) => (
                <div className="rounded-xl border bg-card">
                  <label htmlFor="private">
                    <div className="p-4 h-full">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Lock className="h-4 w-4" />
                          <span className="flex items-center gap-2">
                            Private
                          </span>
                        </div>

                        <Checkbox
                          id="private"
                          onCheckedChange={field.onChange}
                          checked={!!field.value}
                          className="mt-0.5"
                        />
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Control who can view your project, and customize your
                        privacy preferences to keep your project secure.
                      </p>
                    </div>
                  </label>
                </div>
              )}
            />
            {mode === "edit" && (
              <div className="rounded-xl border border-destructive bg-destructive/20 p-4">
                <div className="flex items-center mb-4 gap-2 text-destructive">
                  <TriangleAlert className="h-4 w-4" />
                  <span className="flex items-center gap-2">
                    Delete project
                  </span>
                </div>
                <Dialog>
                  <div className="flex flex-col gap-2">
                    <p className="mt-1 text-sm text-muted-foreground">
                      Permanently remove your project and all associated data.
                      This action cannot be undone.
                    </p>
                    <DialogTrigger asChild>
                      <Button
                        type="button"
                        variant={"destructive"}
                        className="ml-auto"
                      >
                        Delete
                      </Button>
                    </DialogTrigger>
                  </div>

                  <DeleteProjectModal />
                </Dialog>
              </div>
            )}
          </div>
        </section>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={() => nav(-1)}>
            Cancel
          </Button>
          <Button type="submit" disabled={isManipulateProjectPending}>
            {mode === "create"
              ? isManipulateProjectPending
                ? "Creating..."
                : "Create project"
              : isManipulateProjectPending
                ? "Saving..."
                : "Save changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
