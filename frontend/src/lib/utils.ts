import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const getImageUrl = (path: string) => {
  if (!path) return "";
  const baseURL = import.meta.env.VITE_API_URL;
  return `${baseURL}/storage/${path}`;
};

export { getImageUrl };
