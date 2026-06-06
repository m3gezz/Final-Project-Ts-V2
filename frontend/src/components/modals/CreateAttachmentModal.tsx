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
import type { createAttachmentSchemaType } from "@/zod/messagesSchemas";
import {
  ChevronDown,
  File,
  Image,
  Paperclip,
  Send,
  Video,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { createAttachment } from "@/api/functions/messages";

export default function CreateAttachmentModal() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const disp = useAppDispatch();
  const { user } = useAppSelector((state) => state?.auth);
  const [open, setOpen] = useState<boolean>(false);

  const imagesRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [documentPreview, setDocumentPreview] = useState<File | null>(null);

  const { isAttachmentMessage } = useAppSelector((state) => state?.modal);
  const form = useForm<createAttachmentSchemaType>({
    defaultValues: {
      message: "",
      file: undefined,
      workspace_id: String(id),
    },
  });

  const {
    mutate: createAttachmentMutation,
    isPending: isCreateAttachmentPending,
  } = useMutation({
    mutationFn: (data: createAttachmentSchemaType) => {
      const formData = new FormData();
      formData.append("workspace_id", data?.workspace_id);
      formData.append("file", data?.file);
      formData.append("message", data?.message!);
      return createAttachment(formData);
    },
    onMutate: (data) => {
      queryClient.cancelQueries();
      disp(toggleModal({ name: "isAttachmentMessage" }));
      const previous = queryClient.getQueryData(["messages", String(id)]);
      const mainType = data?.file?.type?.split("/")?.[0];

      const fileType = ["image", "video"].includes(mainType)
        ? mainType
        : "document";

      queryClient.setQueryData(
        ["messages", String(id)],
        (old: PopulatedMessage[]) => [
          ...old,
          {
            id: Date.now(),
            user,
            message: data?.message,
            created_at: Date(),
            attachment: {
              id: Date.now(),
              file_path: URL.createObjectURL(data?.file),
              file_size: data?.file?.size,
              file_name: data?.file?.name,
              file_type: fileType,
            },
          },
        ],
      );
      return { previous };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["messages", String(id)],
      });
    },
  });

  const clearAllFiles = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    if (videoPreview) URL.revokeObjectURL(videoPreview);

    setImagePreview(null);
    setVideoPreview(null);
    setDocumentPreview(null);

    form.reset({
      message: "",
      file: undefined,
      workspace_id: String(id),
    });

    if (imagesRef.current) imagesRef.current.value = "";
    if (videoRef.current) videoRef.current.value = "";
    if (fileRef.current) fileRef.current.value = "";
  };

  useEffect(() => {
    clearAllFiles();
    setOpen(false);

    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      if (videoPreview) URL.revokeObjectURL(videoPreview);
    };
  }, [isAttachmentMessage]);

  return (
    <Dialog
      open={isAttachmentMessage}
      onOpenChange={() => disp(toggleModal({ name: "isAttachmentMessage" }))}
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
              onClick={clearAllFiles}
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
              onClick={clearAllFiles}
              size={"icon-xs"}
              className="absolute top-1 right-1"
            >
              <X />
            </Button>
          </div>
        )}

        {documentPreview && (
          <div className="aspect-video relative rounded-md overflow-clip flex items-center justify-center gap-6">
            <div className="bg-accent w-1/2 p-4 rounded-lg flex items-center gap-2">
              <File className="w-20 h-20" />
              <div>
                <h1>{documentPreview?.name}</h1>
                <h1>{documentPreview?.size}Kb</h1>
              </div>
            </div>
            <Button
              variant={"destructive"}
              onClick={clearAllFiles}
              size={"icon-xs"}
              className="absolute top-1 right-1"
            >
              <X />
            </Button>
          </div>
        )}

        <form
          className="flex items-end gap-4"
          onSubmit={form.handleSubmit((data) => createAttachmentMutation(data))}
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
                  clearAllFiles();
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
                  clearAllFiles();
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
                  clearAllFiles();
                  fileRef.current?.click();
                }}
              >
                <File /> Documents
              </Button>
            </div>
            <Button
              type="button"
              variant={"outline"}
              disabled={isCreateAttachmentPending}
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
          <Button disabled={isCreateAttachmentPending}>
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
              setDocumentPreview(file);
              form.setValue("file", file);
            }}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
