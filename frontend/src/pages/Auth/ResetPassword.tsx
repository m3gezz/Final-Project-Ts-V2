import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function ResetPassword() {
  const nav = useNavigate();
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  return (
    <AuthLayout
      title="Set a new password"
      subtitle="Make it strong and memorable."
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (pw !== confirm) return toast.error("Passwords do not match");
          toast.success("Password reset");
          nav("/signin");
        }}
        className="space-y-4"
      >
        <div className="space-y-2">
          <Label htmlFor="pw">New password</Label>
          <Input
            id="pw"
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm">Confirm password</Label>
          <Input
            id="confirm"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full">
          Reset password
        </Button>
      </form>
    </AuthLayout>
  );
}
