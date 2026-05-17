import { Controller, type FieldValues } from "react-hook-form";
import { Checkbox } from "../ui/checkbox";
import { Field, FieldError } from "../ui/field";
import type { ControllerType } from "@/assets/types";

export default function CheckBoxController<T extends FieldValues>({
  control,
  f,
}: ControllerType<T>) {
  return (
    <Controller
      name={f?.name}
      control={control}
      render={({ field, fieldState }) => (
        <Field>
          <label className="flex items-start gap-2 font-normal text-sm text-muted-foreground">
            <Checkbox
              onCheckedChange={field.onChange}
              checked={field.value}
              className="mt-0.5"
              aria-invalid={fieldState.invalid}
            />
            <span>
              I agree to the{" "}
              <a className="text-primary hover:underline" href="#">
                Terms
              </a>{" "}
              and{" "}
              <a className="text-primary hover:underline" href="#">
                Privacy Policy
              </a>
              .
            </span>
          </label>
          {fieldState.error && (
            <FieldError>{fieldState.error.message}</FieldError>
          )}
        </Field>
      )}
    />
  );
}
