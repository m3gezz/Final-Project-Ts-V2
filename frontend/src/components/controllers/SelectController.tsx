import { Field, FieldError, FieldLabel } from "../ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import type { FieldType } from "@/assets/types";
import type { DataType } from "@/assets/types";

type SelectControllerType<T extends FieldValues> = {
  control: Control<T>;
  f: Omit<FieldType, "name"> & { name: Path<T> };
  options: Pick<DataType, "id" | "label">[] | undefined;
};

export default function SelectController<T extends FieldValues>({
  control,
  f,
  options,
}: SelectControllerType<T>) {
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
