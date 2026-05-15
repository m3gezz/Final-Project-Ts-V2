import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Controller } from "react-hook-form";
import { Input } from "../ui/input";
import { Link } from "react-router-dom";
import type { FieldType } from "./CheckBoxController";

export default function InputController({
  control,
  f,
}: {
  control: any;
  f: FieldType;
}) {
  return (
    <Controller
      control={control}
      name={f?.name}
      render={({ field, fieldState }) => (
        <Field className="space-y-2" data-invalid={fieldState.invalid}>
          <div className="flex items-center justify-between">
            {f?.label && <FieldLabel htmlFor={f?.name}>{f?.label}</FieldLabel>}
            {f?.link && (
              <Link
                to={f?.link?.path}
                className="text-xs text-muted-foreground hover:text-primary"
              >
                {f?.link?.label}
              </Link>
            )}
          </div>
          <Input
            {...field}
            id={f?.name}
            type={f?.type}
            placeholder={f?.placeholder}
            autoComplete="off"
            aria-invalid={fieldState.invalid}
          />
          {fieldState.error && (
            <FieldError>{fieldState.error.message}</FieldError>
          )}
        </Field>
      )}
    />
  );
}
