import { Controller, type FieldValues } from "react-hook-form";
import { Field, FieldLabel, FieldError } from "../ui/field";
import { Textarea } from "../ui/textarea";
import type { ControllerType } from "@/assets/types";

export default function TextareaController<T extends FieldValues>({
  control,
  f,
  className = "",
}: ControllerType<T> & { className?: string }) {
  return (
    <Controller
      name={f?.name}
      control={control}
      render={({ field, fieldState }) => (
        <Field className="space-y-2" data-invalid={fieldState.invalid}>
          {f?.label && <FieldLabel>{f?.label}</FieldLabel>}
          <Textarea
            {...field}
            rows={5}
            aria-invalid={fieldState.invalid}
            placeholder={f?.placeholder}
            className={className}
          />
          {fieldState.error && (
            <FieldError>{fieldState.error.message}</FieldError>
          )}
        </Field>
      )}
    />
  );
}
