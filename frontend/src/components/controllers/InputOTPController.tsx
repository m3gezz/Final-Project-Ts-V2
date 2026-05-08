import { Controller } from "react-hook-form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export default function InputOTPController({ control, f }) {
  return (
    <Controller
      control={control}
      name={f?.name}
      render={({ field, fieldState }) => (
        <div className="flex justify-center">
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
        </div>
      )}
    />
  );
}
