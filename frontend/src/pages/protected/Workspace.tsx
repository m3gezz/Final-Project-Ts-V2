import { useParams } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { getWorkspace } from "@/api/functions/workspace";
import { Link } from "react-router-dom";
import WorkspaceSkeleton from "@/components/skeletons/WorkspaceSkeleton";
import { formatTime } from "@/lib/utils";

export default function Workspace() {
  const { id } = useParams();
  const { data: workspace, isLoading } = useQuery({
    queryKey: ["workspace", id, "overview"],
    queryFn: () => getWorkspace(id, "overview"),
    staleTime: 1000 * 60 * 10,
  });

  const percentage =
    ((workspace?.tasks_count - workspace?.open_tasks_count) * 100) /
    workspace?.tasks_count;

  if (isLoading) return <WorkspaceSkeleton />;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {workspace?.project?.title}'s Workspace
        </h1>
        <p className="text-sm text-muted-foreground">
          Project overview & activity
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-card p-5">
          <div className="text-sm text-muted-foreground">Progress</div>
          <div className="mt-1 text-3xl font-semibold">{percentage ?? 0}%</div>
          <Progress value={percentage ?? 0} className="mt-3" />
        </div>
        <Link
          to={"tasks"}
          className="rounded-xl border bg-card p-4 hover:border-primary/50"
        >
          <div className="text-sm text-muted-foreground">Open tasks</div>
          <div className="mt-1 text-3xl font-semibold">
            {workspace?.open_tasks_count ?? 0}
          </div>
        </Link>
        <Link
          to={"members"}
          className="rounded-xl border bg-card p-4 hover:border-primary/50"
        >
          <div className="text-sm text-muted-foreground">Members</div>
          <div className="mt-1 text-3xl font-semibold">
            {workspace?.memberships_count ?? 0}
          </div>
        </Link>
      </div>
      <div className="rounded-xl border bg-card p-6">
        <h2 className="text-lg font-semibold">Recent activity</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {workspace?.tasks?.map((t) => (
            <li key={t?.id} className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Task <i>"{t?.title}"</i> is
              {t?.status === "todo"
                ? "created"
                : t?.status === "doing"
                  ? "advancing"
                  : "done"}
              by
              <b>{t?.user?.full_name}</b>
              <span className="ml-auto text-xs text-muted-foreground">
                {formatTime(t?.created_at)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// function WSettings({ name }: { name: string }) {
//   const [n, setN] = useState(name);
//   return (
//     <div className="max-w-2xl space-y-6">
//       <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
//       <div className="rounded-xl border bg-card p-6 space-y-4">
//         <div className="space-y-2">
//           <label className="text-sm font-medium">Workspace name</label>
//           <Input value={n} onChange={(e) => setN(e.target.value)} />
//         </div>
//         <div className="flex justify-end">
//           <Button onClick={() => toast.success("Saved")}>Save</Button>
//         </div>
//       </div>
//       <div className="rounded-xl border border-destructive/30 bg-card p-6">
//         <h2 className="text-lg font-semibold text-destructive">Danger zone</h2>
//         <p className="mt-1 text-sm text-muted-foreground">
//           Deleting a workspace removes all chat, tasks and attachments.
//         </p>
//         <Button variant="destructive" className="mt-4">
//           Delete workspace
//         </Button>
//       </div>
//     </div>
//   );
// }
