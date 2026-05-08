import WorkspaceCard from "@/components/cards/WorkspaceCard";
import Header from "@/components/slices/Header";
import { workspaces } from "@/data/exp";

export default function Workspaces() {
  return (
    <div>
      <Header
        title="Workspaces"
        description="Private spaces where your teams collaborate."
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {workspaces.map((w) => (
          <WorkspaceCard key={w.id} workspace={w} />
        ))}
      </div>
    </div>
  );
}
