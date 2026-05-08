import { useNavigate } from "react-router-dom";
import AuthCard from "@/components/cards/AuthCard";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useState } from "react";

export default function VerifyResetCode() {
  const nav = useNavigate();
  const [code, setCode] = useState("");
  return (
    <AuthCard
      title="Enter reset code"
      subtitle="Check your email for the 6-digit code."
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          nav("/reset-password");
        }}
        className="space-y-6"
      >
        <div className="flex justify-center">
          <InputOTP maxLength={6} value={code} onChange={setCode}>
            <InputOTPGroup>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <InputOTPSlot key={i} index={i} />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>
        <Button type="submit" className="w-full" disabled={code.length < 6}>
          Continue
        </Button>
      </form>
    </AuthCard>
  );
}
