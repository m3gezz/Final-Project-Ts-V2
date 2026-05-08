import { useNavigate } from "react-router-dom";
import AuthCard from "@/components/cards/AuthCard";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useState } from "react";
import { Mail } from "lucide-react";

export default function VerifyEmail() {
  const nav = useNavigate();
  const [code, setCode] = useState("");
  return (
    <AuthCard
      title="Verify your email"
      subtitle="We sent a 6-digit code to your inbox."
    >
      <div className="mb-6 flex justify-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <Mail className="h-6 w-6" />
        </div>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          nav("/app");
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
          Verify and continue
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Didn't get the email?{" "}
          <button type="button" className="text-primary hover:underline">
            Resend
          </button>
        </p>
      </form>
    </AuthCard>
  );
}
