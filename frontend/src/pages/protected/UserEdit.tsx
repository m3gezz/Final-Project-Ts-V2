import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X, Camera } from "lucide-react";
import SectionHeader from "@/components/common/SectionHeader";
import { findUser } from "@/app/mock-data";
import { toast } from "sonner";

export default function UserEdit() {
  const nav = useNavigate();
  const u = findUser("u1");
  const [avatar, setAvatar] = useState(u.avatar);
  const [fullName, setFullName] = useState(u.full_name);
  const [username, setUsername] = useState(u.username);
  const [bio, setBio] = useState(u.bio);
  const [about, setAbout] = useState(u.about);
  const [skills, setSkills] = useState<string[]>(u.skills);
  const [skillInput, setSkillInput] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile updated");
    nav("/profile");
  };

  return (
    <div className="mx-auto max-w-3xl">
      <SectionHeader
        title="Edit profile"
        description="Keep your profile fresh and discoverable."
      />
      <form
        onSubmit={onSubmit}
        className="space-y-6 rounded-xl border bg-card p-6"
        style={{ boxShadow: "var(--shadow-soft)" }}
      >
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={avatar} />
            <AvatarFallback>{fullName[0]}</AvatarFallback>
          </Avatar>
          <label className="cursor-pointer">
            <Button type="button" variant="outline" asChild>
              <span>
                <Camera className="mr-2 h-4 w-4" />
                Change avatar
              </span>
            </Button>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setAvatar(URL.createObjectURL(f));
              }}
            />
          </label>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Full name</Label>
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Username</Label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Bio</Label>
          <Input value={bio} onChange={(e) => setBio(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>About</Label>
          <Textarea
            rows={5}
            value={about}
            onChange={(e) => setAbout(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Skills</Label>
          <div className="flex flex-wrap gap-2">
            {skills.map((s) => (
              <Badge key={s} variant="secondary" className="gap-1">
                {s}
                <button
                  type="button"
                  onClick={() => setSkills(skills.filter((x) => x !== s))}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const s = skillInput.trim();
                  if (s && !skills.includes(s)) setSkills([...skills, s]);
                  setSkillInput("");
                }
              }}
              placeholder="e.g. TypeScript"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const s = skillInput.trim();
                if (s && !skills.includes(s)) setSkills([...skills, s]);
                setSkillInput("");
              }}
            >
              Add
            </Button>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={() => nav(-1)}>
            Cancel
          </Button>
          <Button type="submit">Save changes</Button>
        </div>
      </form>
    </div>
  );
}
