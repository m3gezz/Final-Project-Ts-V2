import type { PopulatedMessage } from "@/assets/types";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { Button } from "../ui/button";
import { useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { toggleModal } from "@/redux/modalSlice";
import TextareaController from "../controllers/TextareaController";
import type { createFileMessageSchemaType } from "@/zod/messagesSchemas";
import {
  ChevronDown,
  File,
  Image,
  Paperclip,
  Send,
  Video,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

export default function CreateFileMessageModal() {
  const { id } = useParams();
  const { user } = useAppSelector((state) => state?.auth);
  const imagesRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<any>(null);
  const [videoPreview, setVideoPreview] = useState<any>(null);
  const [filePreview, setFilePreview] = useState<any>(undefined);
  const [open, setOpen] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const disp = useAppDispatch();
  const { isCreateFileMessage } = useAppSelector((state) => state?.modal);
  const form = useForm<createFileMessageSchemaType>({
    defaultValues: {
      message: "",
      file: undefined,
      type: "file",
      workspace_id: String(id),
    },
  });

  const { mutate: createFileMessage, isPending: isCreateFileMessagePending } =
    useMutation({
      mutationFn: (data: createFileMessageSchemaType) => console.log(data),
      onMutate: (data) => {
        queryClient.cancelQueries();
        disp(toggleModal({ name: "isCreateFileMessage" }));
        const previous = queryClient.getQueryData(["messages", String(id)]);
        queryClient.setQueryData(
          ["messages", String(id)],
          (old: PopulatedMessage[]) => [
            ...old,
            { ...data, id: Date.now, user, created_at: Date() },
          ],
        );

        return { previous };
      },
      onSuccess: () => {
        // queryClient.invalidateQueries({
        //   queryKey: ["messages", String(id)],
        // });
      },
    });
  return (
    <Dialog
      open={isCreateFileMessage}
      onOpenChange={() => disp(toggleModal({ name: "isCreateFileMessage" }))}
    >
      <DialogContent
        aria-describedby=""
        className="rounded-2xl border bg-card p-8"
      >
        <DialogHeader>
          <DialogTitle>Select a File</DialogTitle>
          <DialogDescription>
            Choose a file to upload and share with your team.
          </DialogDescription>
        </DialogHeader>

        {imagePreview && (
          <div className="aspect-video bg-accent relative rounded-md overflow-clip">
            <img src={imagePreview} className="w-full h-full object-cover" />

            <Button
              variant={"destructive"}
              onClick={() => {
                setImagePreview(null);
              }}
              size={"icon-xs"}
              className="absolute top-1 right-1"
            >
              <X />
            </Button>
          </div>
        )}

        {videoPreview && (
          <div className="aspect-video bg-accent relative rounded-md overflow-clip">
            <video
              controls
              src={videoPreview}
              className="w-full h-full object-cover"
            />
            <Button
              variant={"destructive"}
              onClick={() => setVideoPreview(null)}
              size={"icon-xs"}
              className="absolute top-1 right-1"
            >
              <X />
            </Button>
          </div>
        )}

        {filePreview && (
          <div className="aspect-video relative rounded-md overflow-clip flex items-center justify-center gap-6">
            <div className="bg-accent w-1/2 p-4 rounded-lg flex items-center gap-2">
              <File className="w-20 h-20" />
              <div>
                <h1>{filePreview?.name}</h1>
                <h1>{filePreview?.size}Kb</h1>
              </div>
            </div>
            <Button
              variant={"destructive"}
              onClick={() => setFilePreview(null)}
              size={"icon-xs"}
              className="absolute top-1 right-1"
            >
              <X />
            </Button>
          </div>
        )}

        <form
          className="flex items-end gap-4"
          onSubmit={form.handleSubmit((data) => createFileMessage(data))}
        >
          <div className="relative">
            <div
              className={`flex flex-col absolute bottom-full p-1 left-0 mb-2 ${open ? "opacity-100" : "pointer-events-none opacity-0"} backdrop-blur-2xl rounded-md`}
            >
              <Button
                className="flex items-center justify-start p-2"
                variant={"ghost"}
                type="button"
                onClick={() => {
                  setOpen(false);
                  setFilePreview(null);
                  imagesRef.current?.click();
                }}
              >
                <Image /> Pictures
              </Button>
              <Button
                className="flex items-center justify-start p-2"
                variant={"ghost"}
                type="button"
                onClick={() => {
                  setOpen(false);
                  setFilePreview(null);
                  setImagePreview(null);
                  videoRef.current?.click();
                }}
              >
                <Video /> Videos
              </Button>{" "}
              <Button
                className="flex items-center justify-start p-2"
                variant={"ghost"}
                type="button"
                onClick={() => {
                  setOpen(false);
                  setImagePreview(null);
                  fileRef.current?.click();
                }}
              >
                <File /> Documents
              </Button>
            </div>
            <Button
              type="button"
              variant={"outline"}
              disabled={isCreateFileMessagePending}
              onClick={() => setOpen(!open)}
            >
              {open ? <ChevronDown /> : <Paperclip />}
            </Button>
          </div>
          <div className="w-full">
            <TextareaController
              control={form.control}
              f={{
                name: "message",
                placeholder: "Describe your file",
              }}
              className="min-h-10"
            />
          </div>
          <Button disabled={isCreateFileMessagePending}>
            <Send />
          </Button>

          <input
            ref={imagesRef}
            type="file"
            className="hidden"
            multiple
            accept="image/*"
            onChange={(e) => {
              const image = e.target.files?.[0];
              if (!image) return toast.error("Something went wrong.");
              setImagePreview(URL.createObjectURL(image));
              form.setValue("file", image);
              form.setValue("type", "image");
            }}
          />

          <input
            ref={videoRef}
            type="file"
            className="hidden"
            accept="video/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return toast.error("Something went wrong.");
              setVideoPreview(URL.createObjectURL(file));
              form.setValue("file", file);
              form.setValue("type", "video");
            }}
          />

          <input
            ref={fileRef}
            type="file"
            className="hidden"
            accept=".pdf,.txt"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return toast.error("Something went wrong.");
              setFilePreview(file);

              form.setValue("file", file);
              form.setValue("type", "file");
            }}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
