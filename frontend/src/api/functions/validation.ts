import { AxiosError } from "axios";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";

interface LaravelValidationErrorResponse {
  errors: Record<string, string[] | string>;
  message?: string;
}

export function handleApiErrors<T extends FieldValues>(
  err: unknown,
  form: UseFormReturn<T>,
): boolean {
  if (!(err instanceof AxiosError) || !err.response) {
    alert("An unexpected network error occurred.");
    return false;
  }

  const res = err.response;
  if (res.status !== 422) {
    alert(res.data?.message || "Something went wrong.");
    return false;
  }

  const data = res.data as LaravelValidationErrorResponse;
  const errors = data?.errors;

  if (errors) {
    for (const key in errors) {
      const errorPayload = errors[key];
      const message = Array.isArray(errorPayload)
        ? errorPayload[0]
        : errorPayload;

      if (message) {
        form.setError(key as Path<T>, { message });
      }
    }
  }

  return true;
}
