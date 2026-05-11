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
import { createProjectSchema } from "@/zod/schemas";
import {
  checkProject,
  createProject,
  updateProject,
} from "@/api/functions/project";
import { getCategories } from "@/api/functions/data";
import { getImageUrl } from "@/lib/utils";

const textareaFields = [
  {
    name: "description",
    label: "Description",
  },
  {
    name: "manifesto",
    label: "Manifesto",
  },
];

export default function ProjectManipulator({
  mode,
}: {
  mode: "create" | "edit";
}) {
  const nav = useNavigate();
  const { id } = useParams();
  const [
    { data: project, isError, isLoading, isSuccess },
    { data: categories },
  ] = useQueries({
    queries: [
      {
        queryKey: ["project-check", id],
        queryFn: () => checkProject(id),
        retry: 0,
      },
      {
        queryKey: ["categories"],
        queryFn: getCategories,
        staleTime: Infinity,
      },
    ],
  });

  const [skills, setSkills] = useState<[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const form = useForm({
    defaultValues: {
      image: null,
      title: "",
      description: "",
      category_id: "1",
      skills: "",
      manifesto: "",
      private: false,
    },
    resolver: zodResolver(createProjectSchema),
  });

  useEffect(() => {
    if (!isSuccess) return;
    setSkills(project?.skills);
    setPreview(getImageUrl(project?.image));
    form.setValues({
      image: null,
      title: project?.title ?? "",
      description: project?.description ?? "",
      category_id: String(project?.category_id) ?? "1",
      skills: "",
      manifesto: project?.manifesto ?? "",
      private: !!Number(project?.private),
    });
  }, [isSuccess]);

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (data) => {
      const formData = new FormData();
      data = { ...data, private: data?.private ? "1" : "0" };
      for (const key in data) {
        if (data[key] !== undefined && data[key] !== null) {
          formData.append(key, data[key]);
        }
      }

      skills.forEach((s) => {
        formData.append("skills[]", s.id);
      });

      if (data.image instanceof File) {
        formData.append("image", data.image);
      }

      if (mode !== "edit") {
        return createProject(formData);
      }

      formData.append("_method", "PATCH");
      return updateProject(id, formData);
    },
    onError: (err) => {
      const res = err.response;
      if (res.status !== 422) return alert("error");

      const errors = res.data.errors;
      for (const key in errors) {
        form.setError(key, { message: errors[key] });
      }
    },
    onSuccess: (data) => {
      if (mode === "edit") {
        queryClient.invalidateQueries({
          queryKey: ["project", String(id)],
        });

        queryClient.invalidateQueries({
          queryKey: ["project-check", String(id)],
        });
      }
      nav(`/projects/${data?.data?.id}`);
    },
  });

  if (isLoading) {
    return <Spinner />;
  }

  if (isError && mode === "edit") {
    return <>Error</>;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Header
        title={mode === "create" ? "Create a project" : "Edit project"}
        description="Tell the community what you're building and the team you need."
      />
      <form
        onSubmit={form.handleSubmit((data) => mutate(data))}
        className="space-y-6 rounded-xl border bg-card p-6"
        style={{ boxShadow: "var(--shadow-soft)" }}
      >
        <div className="space-y-2">
          <Label>Cover image</Label>
          <label className="relative aspect-video flex  w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-dashed ">
            <img src={preview} alt="" className="h-full w-full object-cover" />

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
                          checked={field.value}
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

                  <DeleteProjectModal id={id} />
                </Dialog>
              </div>
            )}
          </div>
        </section>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={() => nav(-1)}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {mode === "create"
              ? isPending
                ? "Creating..."
                : "Create project"
              : isPending
                ? "Saving..."
                : "Save changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
