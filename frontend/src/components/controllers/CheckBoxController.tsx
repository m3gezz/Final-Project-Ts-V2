import { Controller } from "react-hook-form";
import { Checkbox } from "../ui/checkbox";

export default function CheckBoxController({ control, f }) {
  return (
    <Controller
      name={f?.name}
      control={control}
      render={({ field, fieldState }) => (
        <>
          <label className="flex items-start gap-2 text-sm text-muted-foreground">
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
        </>
      )}
    />
  );
}
