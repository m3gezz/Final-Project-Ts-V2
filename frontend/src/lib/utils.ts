import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const getImageUrl = (path: string | undefined) => {
  if (!path) return "";
  const baseURL = import.meta.env.VITE_API_URL;
  return `${baseURL}/storage/${path}`;
};

function formatTime(created_at: string) {
  if (!created_at) return "";

  const createdDate: any = new Date(created_at);
  const now: any = new Date();
  const diffInMs = now - createdDate;

  const diffInMins = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMins < 1) return "Just now";
  if (diffInMins < 60) return `${diffInMins}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays < 7) return `${diffInDays}d ago`;
}

export { cn, getImageUrl, formatTime };
