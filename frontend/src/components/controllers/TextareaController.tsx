import { Controller } from "react-hook-form";
import { Field, FieldLabel, FieldError } from "../ui/field";
import { Textarea } from "../ui/textarea";
import type { FieldType } from "./CheckBoxController";

export default function TextareaController({ control, f }: { f: FieldType }) {
  return (
    <Controller
      name={f?.name}
      control={control}
      render={({ field, fieldState }) => (
        <Field className="space-y-2" data-invalid={fieldState.invalid}>
          <FieldLabel>{f?.label}</FieldLabel>
          <Textarea {...field} rows={5} aria-invalid={fieldState.invalid} />
          {fieldState.error && (
            <FieldError>{fieldState.error.message}</FieldError>
          )}
        </Field>
      )}
    />
  );
}
