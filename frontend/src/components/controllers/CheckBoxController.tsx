import { Controller } from "react-hook-form";
import { Checkbox } from "../ui/checkbox";
import { Field, FieldError } from "../ui/field";

export type FieldType = {
  name: string;
  label?: string;
  type?: string;
  placeholder?: string;
  link?: { name: string; label: string; path: string };
};

export default function CheckBoxController({ control, f }: { f: FieldType }) {
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
