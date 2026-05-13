import { Field, FieldError, FieldLabel } from "../ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller } from "react-hook-form";
import type { FieldType } from "./CheckBoxController";
import type { Skill } from "../cards/UserCard";

export default function SelectController({
  control,
  f,
  options,
}: {
  f: FieldType;
  options: Skill[];
}) {
  return (
    <Controller
      name={f?.name}
      control={control}
      render={({ field, fieldState }) => (
        <Field className="space-y-2" data-invalid={fieldState.invalid}>
          <FieldLabel>{f?.label}</FieldLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {options?.map((o) => (
                <SelectItem key={o?.id} value={String(o?.id)}>
                  {o?.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {fieldState.error && (
            <FieldError>{fieldState.error.message}</FieldError>
          )}
        </Field>
      )}
    />
  );
}
