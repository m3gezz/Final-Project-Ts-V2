import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Lock, TriangleAlert } from "lucide-react";
import Header from "@/components/slices/Header";
import { Controller, useForm } from "react-hook-form";
import InputController from "@/components/controllers/InputController";
import TextareaController from "@/components/controllers/TextareaController";
import SkillsController from "@/components/controllers/SkillsController";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@/components/ui/checkbox";
import DeleteAccModal from "@/components/modals/DeleteAccModal";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import ModifyPassModal from "@/components/modals/ModifyPassModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "@/api/functions/users";
import { getImageUrl } from "@/lib/utils";
import { updateUserSchema } from "@/zod/usersSchemas";
import type { DataType } from "@/assets/types";
import { getMe } from "@/api/functions/auth";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { handleApiErrors } from "@/api/functions/validation";

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
  const avatarRef = useRef("");
  const { user } = useAppSelector((state) => state?.auth);
  const [skills, setSkills] = useState<DataType[]>(user?.skills ?? []);
  const [preview, setPreview] = useState(getImageUrl(user?.avatar));
  const form = useForm({
    defaultValues: {
      avatar: null,
      full_name: user?.full_name ?? "",
      username: user?.username ?? "",
      email: user?.email ?? "",
      bio: user?.bio ?? "",
      about: user?.about ?? "",
      professional_title: user?.professional_title ?? "",
      skills: "",
      private: !!Number(user?.private),
    },
    resolver: zodResolver(updateUserSchema),
  });

  const nav = useNavigate();
  const disp = useAppDispatch();
  const queryClient = useQueryClient();
  const isDirty = form.formState.isDirty;
  const dirtyFields = form.formState.dirtyFields;
  const { mutate, isPending } = useMutation({
    mutationFn: (args: { id: number | string; data: any }) => {
      let data = args.data;
      data = { ...data, private: data?.private ? "1" : "0" };
      const skillsIds = skills.map((s) => s?.id);
      const userSkillsIds = user?.skills.map((s: DataType) => s?.id) || [];
      const skillsChanged = !(
        skillsIds.length === userSkillsIds.length &&
        skillsIds.every((id) => userSkillsIds.includes(id))
      );

      if (!isDirty && !skillsChanged && !(data.avatar instanceof File)) {
        return alert("No changes detected!");
      }

      const formData = new FormData();
      for (const key in dirtyFields) {
        if (data[key] !== undefined && data[key] !== null) {
          formData.append(key, data[key]);
        }
      }

      if (skillsChanged) {
        skillsIds?.forEach((s) => {
          formData.append("skills[]", String(s));
        });
      }

      if (data?.avatar instanceof File) {
        formData.append("avatar", data.avatar);
      }

      formData.append("_method", "PATCH");
      return updateUser(user?.id, formData);
    },
    onError: (err) => {
      handleApiErrors(err, form);
    },
    onSuccess: (data) => {
      queryClient.fetchQuery({ queryKey: ["me"], queryFn: () => getMe(disp) });
      queryClient.invalidateQueries({
        queryKey: ["profile", String(user?.id)],
      });
      if (data) {
        nav(-1);
      }
    },
  });

  return (
    <div className="mx-auto max-w-3xl">
      <Header
        title="Edit profile"
        description="Keep your profile fresh and discoverable."
      />
      <form
        onSubmit={form.handleSubmit((data) => mutate({ id: user.id, data }))}
        className="space-y-6 rounded-xl border bg-card p-6"
        style={{ boxShadow: "var(--shadow-soft)" }}
      >
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={preview} />
            <AvatarFallback>{user?.full_name?.[0]}</AvatarFallback>
          </Avatar>
          <Button
            type="button"
            variant="outline"
            onClick={() => avatarRef.current.click()}
          >
            <Camera className="mr-2 h-4 w-4" />
            Change avatar
          </Button>
          <input
            ref={avatarRef}
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
                <ModifyPassModal />
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

                <DeleteAccModal />
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
