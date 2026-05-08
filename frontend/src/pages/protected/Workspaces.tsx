import SectionHeader from "@/components/common/SectionHeader";
import WorkspaceCard from "@/components/cards/WorkspaceCard";
import { workspaces } from "@/app/mock-data";

export default function Workspaces() {
  return (
    <div>
      <SectionHeader
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
