import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthCard from "@/components/cards/AuthCard";

export default function ForgotPassword() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  return (
    <AuthCard
      title="Forgot your password?"
      subtitle="Enter your email and we'll send a reset code."
      footer={
        <Link to="/signin" className="text-primary hover:underline">
          Back to sign in
        </Link>
      }
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          nav("/verify-reset-code", { state: { email } });
        }}
        className="space-y-4"
      >
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <Button type="submit" className="w-full">
          Send reset code
        </Button>
      </form>
    </AuthCard>
  );
}
