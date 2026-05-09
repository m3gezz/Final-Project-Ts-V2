import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Lock, TriangleAlert } from "lucide-react";
import Header from "@/components/slices/Header";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import InputController from "@/components/controllers/InputController";
import TextareaController from "@/components/controllers/TextareaController";
import SkillsController from "@/components/controllers/SkillsController";
import { zodResolver } from "@hookform/resolvers/zod";
import { userEditSchema } from "@/zod/schemas";
import { Checkbox } from "@/components/ui/checkbox";
import DeleteAccModal from "@/components/modals/DeleteAccModal";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import ModifyPassModal from "@/components/modals/ModifyPassModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/axios";
import { me } from "@/api/apiFunctions";

const fields = [
  {
    name: "full_name",
    type: "text",
    label: "Full Name",
    placeholder: "",
  },
  {
    name: "username",
    type: "text",
    label: "Username",
    placeholder: "",
  },
  {
    name: "bio",
    type: "text",
    label: "Bio",
    placeholder: "",
  },
  {
    name: "email",
    type: "text",
    label: "Email",
    placeholder: "you@company.com",
  },
];

export default function UserEdit() {
  const { user } = useSelector((state) => state?.auth);
  const [skills, setSkills] = useState<[]>(user?.skills ?? []);
  const [preview, setPreview] = useState(user?.avatar ?? "");
  const form = useForm({
    defaultValues: {
      avatar: user?.avatar ?? null,
      full_name: user?.full_name ?? "",
      username: user?.username ?? "",
      email: user?.email ?? "",
      bio: user?.bio ?? "",
      about: user?.about ?? "",
      professional_title: user?.professional_title ?? "",
      skills: "",
      private: !!user?.private,
    },
    resolver: zodResolver(userEditSchema),
  });

  const nav = useNavigate();
  const disp = useDispatch();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => updateUser(data),
    onError: (err) => {
      const res = err.response;
      if (res.status !== 422) return alert("error");

      const errors = res.data.errors;
      for (const key in errors) {
        form.setError(key, { message: errors[key] });
      }
    },
    onSuccess: () => {
      queryClient.fetchQuery({ queryKey: ["me"], queryFn: () => me(disp) });
    },
  });

  const dirtyFields = form.formState.dirtyFields;
  const isDirty = form.formState.isDirty;

  const updateUser = async (data) => {
    const skillsIds = skills.map((s) => s?.id);
    const userSkillsIds = user?.skills.map((s) => s?.id);
    const isEqual =
      skillsIds.length === userSkillsIds.length &&
      skillsIds.every((v, i) => v === userSkillsIds[i]);

    const isOnlySkillsDirty =
      Object.keys(dirtyFields).length === 1 && dirtyFields.skills === true;

    if ((isEqual && !isDirty) || isOnlySkillsDirty)
      return alert("change first");

    let dirtyData = {};
    for (const key in dirtyFields) {
      dirtyData = { ...dirtyData, [key]: data[key] };
    }

    const res = await api.patch(`users/${user?.id}`, {
      ...dirtyData,
      skills: skillsIds,
    });

    return res;
  };

  return (
    <div className="mx-auto max-w-3xl">
      <Header
        title="Edit profile"
        description="Keep your profile fresh and discoverable."
      />
      <form
        onSubmit={form.handleSubmit((data) => mutate(data))}
        className="space-y-6 rounded-xl border bg-card p-6"
        style={{ boxShadow: "var(--shadow-soft)" }}
      >
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={preview} />
            <AvatarFallback>{user?.full_name?.[0]}</AvatarFallback>
          </Avatar>
          <label className="cursor-pointer">
            <Button type="button" variant="outline" asChild>
              <span>
                <Camera className="mr-2 h-4 w-4" />
                Change avatar
              </span>
            </Button>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) {
                  form.setValue("avatar", f);
                  setPreview(URL.createObjectURL(f));
                }
              }}
            />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {fields?.map((f, i) => (
            <InputController key={i} control={form.control} f={f} />
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <InputController
            control={form.control}
            f={{
              name: "professional_title",
              type: "text",
              label: "Professional Title",
              placeholder: "",
            }}
          />
          <SkillsController form={form} skills={skills} setSkills={setSkills} />
        </div>

        <TextareaController
          control={form.control}
          f={{
            name: "about",
            label: "About",
            placeholder: "",
          }}
        />

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
                        Control who can view your profile, and customize your
                        privacy preferences to keep your account secure.
                      </p>
                    </div>
                  </label>
                </div>
              )}
            />
            <div className="rounded-xl border border-primary bg-primary/20 p-4">
              <div className="flex items-center gap-2 mb-4 text-primary">
                <Lock className="h-4 w-4" />
                <span className="flex items-center gap-2">Change password</span>
              </div>
              <Dialog>
                <div className="flex flex-col gap-2">
                  <p className="mt-1 text-sm text-muted-foreground">
                    Update your password regularly to protect your account and
                    maintain a higher level of security.
                  </p>
                  <DialogTrigger asChild>
                    <Button type="button" className="ml-auto">
                      Modify
                    </Button>
                  </DialogTrigger>
                </div>
                <ModifyPassModal id={user?.id} />
              </Dialog>
            </div>
            <div className="rounded-xl border border-destructive bg-destructive/20 p-4">
              <div className="flex items-center mb-4 gap-2 text-destructive">
                <TriangleAlert className="h-4 w-4" />
                <span className="flex items-center gap-2">Delete account</span>
              </div>
              <Dialog>
                <div className="flex flex-col gap-2">
                  <p className="mt-1 text-sm text-muted-foreground">
                    Permanently remove your account and all associated data.
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

                <DeleteAccModal id={user?.id} />
              </Dialog>
            </div>
          </div>
        </section>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={() => nav(-1)}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
