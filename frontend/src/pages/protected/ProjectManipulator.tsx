import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, Earth, TriangleAlert } from "lucide-react";
import Header from "@/components/slices/Header";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Controller, useForm } from "react-hook-form";
import InputController from "@/components/controllers/InputController";
import SkillsController from "@/components/controllers/SkillsController";
import TextareaController from "@/components/controllers/TextareaController";
import SelectController from "@/components/controllers/SelectController";
import { checkProject, getCategories, getProject } from "@/api/apiFunctions";
import { Checkbox } from "@/components/ui/checkbox";
import DeleteAccModal from "@/components/modals/DeleteAccModal";
import { Spinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProjectSchema } from "@/zod/schemas";

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
  let exist = {};
  if (mode === "edit") {
    const { id } = useParams();

    const { isError, isLoading, isSuccess } = useQuery({
      queryKey: ["project-check", id],
      queryFn: () => checkProject(id),
    });

    const { data: project } = useQuery({
      queryKey: ["project", id],
      queryFn: () => getProject(id),
      enabled: isSuccess,
    });

    if (isLoading) {
      return <Spinner />;
    }

    if (isError) {
      return <>Error</>;
    }

    exist = project;
  }

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
  const [skills, setSkills] = useState<[]>(exist?.skills ?? []);
  const [preview, setPreview] = useState(exist?.image ?? "");
  const form = useForm({
    defaultValues: {
      image: exist?.image ?? null,
      title: "",
      description: "",
      category_id: "1",
      skills: "",
      manifesto: "",
      private: false,
    },
    resolver: zodResolver(createProjectSchema),
  });

  const onSubmit = (data) => {
    const projectSkills = skills.map((s) => s.id);
    console.log({ ...data, skills: projectSkills });
  };

  return (
    <div className="mx-auto max-w-3xl">
      <Header
        title={mode === "create" ? "Create a project" : "Edit project"}
        description="Tell the community what you're building and the team you need."
      />
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 rounded-xl border bg-card p-6"
        style={{ boxShadow: "var(--shadow-soft)" }}
      >
        <div className="space-y-2">
          <Label>Cover image</Label>
          <label className="flex aspect-video w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-dashed bg-muted/50 hover:bg-muted">
            {preview ? (
              <img
                src={preview}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Upload className="h-6 w-6" />
                <span className="text-sm">Click to upload an image</span>
              </div>
            )}
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
                          <Earth className="h-4 w-4" />
                          <span className="flex items-center gap-2">
                            Public
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

                  <DeleteAccModal id={6} />
                </Dialog>
              </div>
            )}
          </div>
        </section>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={() => nav(-1)}>
            Cancel
          </Button>
          <Button type="submit">
            {mode === "create" ? "Create project" : "Save changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
