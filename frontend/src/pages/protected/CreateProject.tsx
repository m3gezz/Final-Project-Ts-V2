import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X, Upload } from "lucide-react";
import Header from "@/components/slices/Header";
import { findProject } from "@/data/exp";
import { toast } from "sonner";

export default function CreateProject({ mode }: { mode: "create" | "edit" }) {
  const nav = useNavigate();
  const { id } = useParams();
  const existing = mode === "edit" ? findProject(id || "") : undefined;

  const [title, setTitle] = useState(existing?.title || "");
  const [category, setCategory] = useState(existing?.category || "AI");
  const [image, setImage] = useState(existing?.image || "");
  const [description, setDescription] = useState(existing?.description || "");
  const [manifesto, setManifesto] = useState(existing?.manifesto || "");
  const [skills, setSkills] = useState<string[]>(existing?.skills || []);
  const [skillInput, setSkillInput] = useState("");

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !skills.includes(s)) setSkills([...skills, s]);
    setSkillInput("");
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(mode === "create" ? "Project created" : "Project updated");
    nav("/projects");
  };

  const onPickImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImage(URL.createObjectURL(file));
  };

  return (
    <div className="mx-auto max-w-3xl">
      <Header
        title={mode === "create" ? "Create a project" : "Edit project"}
        description="Tell the community what you're building and the team you need."
      />
      <form
        onSubmit={onSubmit}
        className="space-y-6 rounded-xl border bg-card p-6"
        style={{ boxShadow: "var(--shadow-soft)" }}
      >
        <div className="space-y-2">
          <Label>Cover image</Label>
          <label className="flex aspect-video w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-dashed bg-muted/50 hover:bg-muted">
            {image ? (
              <img src={image} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Upload className="h-6 w-6" />
                <span className="text-sm">Click to upload an image</span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onPickImage}
            />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cat">Category</Label>
            <select
              id="cat"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            >
              {[
                "AI",
                "Productivity",
                "Design",
                "Mobile",
                "Marketing",
                "Other",
              ].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Skills required</Label>
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
              placeholder="e.g. React"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSkill();
                }
              }}
            />
            <Button type="button" variant="outline" onClick={addSkill}>
              Add
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="desc">Description</Label>
          <Textarea
            id="desc"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="man">Manifesto</Label>
          <Textarea
            id="man"
            rows={4}
            placeholder="The why behind the project."
            value={manifesto}
            onChange={(e) => setManifesto(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={() => nav(-1)}>
            Cancel
          </Button>
          <Button type="submit">
            {mode === "create" ? "Create project" : "Save changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
