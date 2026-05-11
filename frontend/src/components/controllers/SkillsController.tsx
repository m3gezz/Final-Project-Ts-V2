import { Field, FieldLabel, FieldError } from "../ui/field";
import { Controller } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getSkills } from "@/api/functions/data";

export default function SkillsController({ form, skills, setSkills }) {
  const { data: allowedSkills } = useQuery({
    queryKey: ["skills"],
    queryFn: getSkills,
    staleTime: Infinity,
  });

  const handleSkill = (skill) => {
    const allowed = allowedSkills?.find(
      (s) => s.label.toLowerCase() === skill.toLowerCase(),
    );
    if (!allowed) return form.setError("skills", { message: "Invalid skill" });

    const exists = skills?.find(
      (s) => s.label.toLowerCase() === skill.toLowerCase(),
    );

    if (exists) {
      setSkills((prev) => [...prev.filter((s) => s.id != allowed.id)]);
    } else {
      setSkills((prev) => [...prev, allowed]);
    }

    form.resetField("skills");
  };
  const selectedSkill = form.watch("skills");

  return (
    <Controller
      control={form?.control}
      name="skills"
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>Skills</FieldLabel>
          <div className="flex gap-2">
            <Input
              {...field}
              aria-invalid={fieldState.invalid}
              placeholder="e.g. TypeScript"
              list="skills"
            />
            <datalist id="skills">
              {allowedSkills?.map((s) => (
                <option key={s?.id} value={s?.label} />
              ))}
            </datalist>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSkill(selectedSkill)}
            >
              Add
            </Button>
          </div>
          {fieldState.error && (
            <FieldError>{fieldState.error.message}</FieldError>
          )}
          <div className="flex flex-wrap gap-2">
            {skills?.slice(0, 3)?.map((s) => (
              <Badge key={s?.id} variant="secondary" className="gap-1">
                {s?.label}
                <button type="button" onClick={() => handleSkill(s?.label)}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {skills?.length > 3 && <Badge variant="secondary">•••</Badge>}
          </div>
        </Field>
      )}
    />
  );
}
