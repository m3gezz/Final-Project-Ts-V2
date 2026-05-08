import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/slices/Header";
import ProjectCard from "@/components/cards/ProjectCard";
import { projects } from "@/data/exp";

const categories = [
  "All",
  "AI",
  "Productivity",
  "Design",
  "Mobile",
  "Marketing",
];
const sorts = ["Most liked", "Newest", "Most active"];

export default function Projects() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [sort, setSort] = useState("Most liked");

  const list = useMemo(() => {
    let r = projects.filter(
      (p) =>
        (cat === "All" || p.category === cat) &&
        p.title.toLowerCase().includes(q.toLowerCase()),
    );
    if (sort === "Most liked") r = [...r].sort((a, b) => b.likes - a.likes);
    return r;
  }, [q, cat, sort]);

  return (
    <div>
      <Header
        title="Projects"
        description="Discover ideas from the community and find your next collaboration."
        action={
          <Button asChild>
            <Link to="/projects/new">
              <Plus className="mr-2 h-4 w-4" />
              New project
            </Link>
          </Button>
        }
      />
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Input
          className="max-w-xs"
          placeholder="Search projects…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <div className="flex flex-wrap gap-1.5">
          {categories.map((c) => (
            <Badge
              key={c}
              variant={cat === c ? "default" : "secondary"}
              onClick={() => setCat(c)}
              className="cursor-pointer"
            >
              {c}
            </Badge>
          ))}
        </div>
        <div className="ml-auto flex gap-1.5">
          {sorts.map((s) => (
            <Badge
              key={s}
              variant={sort === s ? "default" : "outline"}
              onClick={() => setSort(s)}
              className="cursor-pointer"
            >
              {s}
            </Badge>
          ))}
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
    </div>
  );
}
