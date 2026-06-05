import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Lock, Pen, TriangleAlert } from "lucide-react";
import Header from "@/components/slices/Header";
import { Controller, useForm } from "react-hook-form";
import InputController from "@/components/controllers/InputController";
import TextareaController from "@/components/controllers/TextareaController";
import SkillsController from "@/components/controllers/SkillsController";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@/components/ui/checkbox";
import DeleteAccModal from "@/components/modals/DeleteAccModal";
import ModifyPassModal from "@/components/modals/ModifyPassModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "@/api/functions/users";
import { getImageUrl } from "@/lib/utils";
import {
  updateUserSchema,
  type updateUserSchemaType,
} from "@/zod/usersSchemas";
import type { DataType } from "@/assets/types";
import { getMe } from "@/api/functions/auth";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { handleApiErrors } from "@/api/functions/validation";
import { toggleModal } from "@/redux/modalSlice";

const fields = [
  {
    name: "full_name",
    type: "text",
    label: "Display Name",
    placeholder: "Alex Johnson",
  },
  {
    name: "username",
    type: "text",
    label: "Username",
    placeholder: "alex_j",
  },
  {
    name: "bio",
    type: "text",
    label: "Short Bio",
    placeholder: "Product designer & open-source builder based in NYC",
  },
  {
    name: "email",
    type: "text",
    label: "Email Address",
    placeholder: "alex@example.com",
  },
] as const;

export default function UserEdit() {
  const nav = useNavigate();
  const disp = useAppDispatch();
  const queryClient = useQueryClient();
  const avatarRef: any = useRef("");
  const { user } = useAppSelector((state) => state?.auth);
  const [skills, setSkills] = useState<DataType[]>(user?.skills ?? []);
  const [preview, setPreview] = useState(getImageUrl(user?.avatar));
  const form = useForm<updateUserSchemaType>({
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

  const { mutate: updateUserMutation, isPending: isUpdateUserPending } =
    useMutation({
      mutationFn: (data: updateUserSchemaType) => {
        const formData = new FormData();
        formData.append("full_name", data.full_name);
        formData.append("username", data.username);
        formData.append("email", data.email);
        formData.append("bio", data.bio ?? "");
        formData.append("about", data.about ?? "");
        formData.append("professional_title", data.professional_title ?? "");
        formData.append("private", data.private ? "1" : "0");

        skills.forEach((s) => {
          formData.append("skills[]", String(s.id));
        });

        if (data.avatar instanceof File) {
          formData.append("avatar", data.avatar);
        }

        formData.append("_method", "PATCH");
        return updateUser(user?.id, formData);
      },
      onError: (err) => {
        handleApiErrors(err, form);
      },
      onSuccess: () => {
        queryClient.fetchQuery({
          queryKey: ["getMe"],
          queryFn: () => getMe(disp),
          staleTime: 0,
        });
        queryClient.invalidateQueries({
          queryKey: ["profile", String(user?.id)],
        });
        nav(-1);
      },
    });

  return (
    <div className="mx-auto max-w-3xl">
      <Header
        icon={Pen}
        title="Edit profile"
        description="Keep your profile fresh and discoverable."
      />
      <form
        onSubmit={form.handleSubmit((data) => updateUserMutation(data))}
        className="space-y-6 rounded-xl border bg-card p-6"
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
              placeholder: "Professional Title",
            }}
          />
          <SkillsController form={form} skills={skills} setSkills={setSkills} />
        </div>

        <TextareaController
          control={form.control}
          f={{
            name: "about",
            label: "About",
            placeholder: "Say something about yourself.",
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
                          checked={!!field.value}
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

              <div className="flex flex-col gap-2">
                <p className="mt-1 text-sm text-muted-foreground">
                  Update your password regularly to protect your account and
                  maintain a higher level of security.
                </p>

                <Button
                  type="button"
                  className="ml-auto"
                  onClick={() =>
                    disp(toggleModal({ name: "isUpdatePassword" }))
                  }
                >
                  Modify
                </Button>
              </div>
            </div>
            <div className="rounded-xl border border-destructive bg-destructive/20 p-4">
              <div className="flex items-center mb-4 gap-2 text-destructive">
                <TriangleAlert className="h-4 w-4" />
                <span className="flex items-center gap-2">Delete account</span>
              </div>

              <div className="flex flex-col gap-2">
                <p className="mt-1 text-sm text-muted-foreground">
                  Permanently remove your account and all associated data. This
                  action cannot be undone.
                </p>

                <Button
                  type="button"
                  variant={"destructive"}
                  className="ml-auto"
                  onClick={() =>
                    disp(toggleModal({ name: "isDestroyAccount" }))
                  }
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </section>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={() => nav(-1)}>
            Cancel
          </Button>
          <Button type="submit" disabled={isUpdateUserPending}>
            {isUpdateUserPending ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </form>
      <ModifyPassModal />
      <DeleteAccModal />
    </div>
  );
}
