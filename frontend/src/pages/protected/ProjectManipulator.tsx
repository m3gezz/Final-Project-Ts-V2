import { getCategories } from "@/api/functions/data";
import {
  canEdit,
  createProject,
  updateProject,
} from "@/api/functions/projects";
import { handleApiErrors } from "@/api/functions/validation";
import type { DataType } from "@/assets/types";
import EmptyCard from "@/components/cards/EmptyCard";
import InputController from "@/components/controllers/InputController";
import SelectController from "@/components/controllers/SelectController";
import SkillsController from "@/components/controllers/SkillsController";
import TextareaController from "@/components/controllers/TextareaController";
import Header from "@/components/slices/Header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";
import { getImageUrl } from "@/lib/utils";
import {
  manipulateProjectSchema,
  type manipulateProjectSchemaType,
} from "@/zod/projectsSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Lock,
  Pen,
  Plus,
  TriangleAlert,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
import DeleteProjectModal from "@/components/modals/DeleteProjectModal";

const textareaFields = [
  {
    name: "description",
    label: "Project Description",
    placeholder: "What are you building? Briefly describe the goals...",
  },
  {
    name: "manifesto",
    label: "Project Manifesto",
    placeholder:
      "What drives this project? Share your vision, and why this space matters to you...",
  },
] as const;

export default function ProjectManipulator({
  mode = "create",
}: {
  mode: "create" | "update";
}) {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [skills, setSkills] = useState<DataType[]>([]);
  const [preview, setPreview] = useState("");
  const [step, setStep] = useState<number>(1);
  const imagesRef = useRef<HTMLInputElement | null>(null);
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
        enabled: mode === "update",
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
    resolver: zodResolver(manipulateProjectSchema(mode === "update")),
  });

  const {
    mutate: manipulateProjectMutation,
    isPending: isManipulateProjectPending,
    isSuccess: isManipulateProjectSuccess,
    data: response,
  } = useMutation({
    mutationFn: (data: manipulateProjectSchemaType) => {
      if (!skills?.length) {
        form.setError("skills", { message: "Skills are required" });
        throw new Error("Skills are required");
      }
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

      if (mode === "create") {
        return createProject(formData);
      } else {
        formData.append("_method", "PUT");
        return updateProject(id, formData);
      }
    },
    onError: (err: any) => {
      handleApiErrors(err, form);

      const errors = err?.response?.data?.errors || {};
      const hasStep1Error = errors.title || errors.image || errors.skills;
      setStep(hasStep1Error ? 1 : 2);
    },
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  const resetToCreate = () => {
    form.reset({
      image: null,
      title: "",
      description: "",
      category_id: "1",
      skills: "",
      manifesto: "",
      private: false,
    });
    setPreview("");
    setSkills([]);
    if (imagesRef.current) {
      imagesRef.current.value = "";
    }
  };

  useEffect(() => {
    if (!isManipulateProjectSuccess) return;
    setStep(3);
    if (mode === "create") {
      resetToCreate();
    }
  }, [isManipulateProjectSuccess]);

  useEffect(() => {
    if (!isProjectSuccess || mode === "create") {
      resetToCreate();
      return;
    }

    form.reset({
      ...project,
      skills: "",
      image: null,
      private: project?.private === "1",
      category_id: String(project?.category_id),
    });
    setPreview(getImageUrl(project?.image));
    setSkills(project?.skills);
  }, [isProjectSuccess, id, mode, project, categories]);

  if (isProjectError) {
    return "error";
  }

  if (isProjectLoading) {
    return "loading";
  }

  return (
    <div>
      <Header
        title={mode === "create" ? "Create a " : "Update this " + "project"}
        description="Tell the community what you're building and the team you need."
      />

      <section className="w-[90%] mx-auto flex items-center justify-around my-10">
        <Badge className="rounded-full w-8 h-8 text-lg font-bold text-foreground bg-accent">
          1
        </Badge>
        <div className={`${step >= 2 ? "bg-accent" : "bg-muted"} h-2 flex-1`} />

        <Badge
          className={`rounded-full w-8 h-8 text-lg font-bold text-foreground ${step >= 2 ? "bg-accent" : "bg-muted"}`}
        >
          2
        </Badge>
        <div className={`${step >= 3 ? "bg-accent" : "bg-muted"} h-2 flex-1`} />

        <Badge
          className={`rounded-full w-8 h-8 text-lg font-bold text-foreground ${step >= 3 ? "bg-accent" : "bg-muted"}`}
        >
          3
        </Badge>
      </section>

      <section className="w-[90%] mx-auto">
        <form
          onSubmit={form.handleSubmit((data) =>
            manipulateProjectMutation(data),
          )}
          className={`border p-6 rounded-lg`}
        >
          <section
            className={`${step != 1 ? "hidden" : "block"} grid lg:grid-cols-[1fr_1fr] gap-4`}
          >
            <div
              onClick={() => imagesRef?.current?.click()}
              className="aspect-video bg-muted rounded-lg w-full relative group mx-auto overflow-clip"
            >
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="h-full w-full object-contain"
                />
              )}
              <input
                type="file"
                ref={imagesRef}
                className="hidden"
                onChange={(e) => {
                  const image = e?.currentTarget?.files?.[0];
                  if (!image) return;
                  setPreview(URL.createObjectURL(image));
                  form.setValue("image", image);
                  form.clearErrors("image");
                }}
              />
              <span
                className={`absolute transition-all top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 ${preview ? "opacity-0 group-hover:opacity-100" : "opacity-100"}`}
              >
                {preview ? (
                  <Pen className="w-5 h-5" />
                ) : (
                  <Plus className="w-5 h-5" />
                )}
              </span>
              {preview && (
                <Button
                  variant={"destructive"}
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreview("");
                    form.setValue("image", null);
                    if (!imagesRef?.current) return;
                    imagesRef.current.value = "";
                  }}
                  className="absolute top-2 right-2"
                >
                  <X className="w-5 h-5" />
                </Button>
              )}
              {form?.formState?.errors?.image && (
                <span className="text-destructive font-bold absolute bottom-2 left-1/2 -translate-x-1/2">
                  {form?.formState?.errors?.image?.message}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-4">
              <InputController
                control={form.control}
                f={{
                  name: "title",
                  type: "text",
                  label: "Title",
                  placeholder: "Project title",
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

              <SkillsController
                form={form}
                skills={skills}
                setSkills={setSkills}
              />
              <div className="flex items-center justify-end mt-auto">
                <Button
                  variant={"secondary"}
                  type="button"
                  onClick={() => setStep(2)}
                >
                  Next <ChevronRight />
                </Button>
              </div>
            </div>
          </section>
          <section className={`${step != 2 ? "hidden" : "block"} space-y-6`}>
            <div className="grid lg:grid-cols-2 gap-4">
              {textareaFields?.map((f, i) => (
                <TextareaController key={i} control={form.control} f={f} />
              ))}
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
              {mode === "update" && (
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
            <div className="flex items-center justify-between">
              <Button
                variant={"secondary"}
                type="button"
                onClick={() => setStep(1)}
              >
                <ChevronLeft /> Prev
              </Button>
              <Button variant={"secondary"} type="submit">
                {isManipulateProjectPending ? (
                  <Spinner />
                ) : (
                  <>
                    Next <ChevronRight />
                  </>
                )}
              </Button>
            </div>
          </section>
          <section className={`${step != 3 ? "hidden" : "block"}`}>
            <EmptyCard
              icon={Check}
              title="Created Successfully"
              description="Your project has been created, plus its workspace, want to check it ?"
              action={
                <div className="flex flex-col gap-2">
                  <Button asChild>
                    <Link to={`/projects/${response?.id}`}>Check it out</Link>
                  </Button>
                  <Button asChild variant={"secondary"}>
                    <Link to={`/projects`}>Back to projects</Link>
                  </Button>
                </div>
              }
            />
          </section>
        </form>
      </section>
    </div>
  );
}
