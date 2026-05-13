import { Controller } from "react-hook-form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { FieldError } from "../ui/field";
import type { FieldType } from "./CheckBoxController";

export default function InputOTPController({ control, f }: { f: FieldType }) {
  return (
    <Controller
      control={control}
      name={f?.name}
      render={({ field, fieldState }) => (
        <div className="flex flex-col items-center gap-2">
          <InputOTP maxLength={6} {...field}>
            <InputOTPGroup>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <InputOTPSlot
                  key={i}
                  index={i}
                  aria-invalid={fieldState.invalid}
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
          {fieldState.error && (
            <FieldError>{fieldState.error.message}</FieldError>
          )}
        </div>
      )}
    />
  );
}
