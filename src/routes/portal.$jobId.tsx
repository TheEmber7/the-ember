import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { Loader2, Target, ShieldAlert } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { usePortalAuth } from "@/hooks/usePortalAuth";
import { PortalShell } from "@/components/portal/PortalShell";
import { TaskRow, type TaskRowData } from "@/components/portal/TaskRow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

export const Route = createFileRoute("/portal/$jobId")({
  head: () => ({
    meta: [
      { title: "Workspace — The Ember" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: JobPortal,
});

function JobPortal() {
  const { jobId } = Route.useParams();
  const { loading, session } = usePortalAuth();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-ember" />
      </div>
    );
  }
  if (!session) return <AuthForm jobId={jobId} />;
  return <JobDashboard jobSlug={jobId} />;
}

function AuthForm({ jobId }: { jobId: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) toast.error(error.message);
    else toast.success("Welcome back.");
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-6">
      <div className="mb-8 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
          Workspace
        </p>
        <h1 className="mt-3 font-display text-5xl text-foreground">
          The <span className="text-ember ember-glow-text">Forge</span>
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Sign in with the credentials provided to you.
        </p>
        <p className="mt-1 text-xs text-muted-foreground/60">Job: {jobId}</p>
      </div>

      <form
        onSubmit={submit}
        className="space-y-4 rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur"
      >
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type="submit" disabled={busy} className="w-full">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Don't have credentials? Contact the studio.
        </p>
      </form>
    </div>
  );
}

interface JobRow {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  client_id: string;
}
interface GoalWithTasks {
  id: string;
  name: string;
  description: string | null;
  tasks: TaskRowData[];
}

function JobDashboard({ jobSlug }: { jobSlug: string }) {
  const { user, isAdmin } = usePortalAuth();
  const [job, setJob] = useState<JobRow | null>(null);
  const [goals, setGoals] = useState<GoalWithTasks[]>([]);
  const [loading, setLoading] = useState(true);
  const [denied, setDenied] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    // RLS will filter — clients only see their own jobs by slug.
    const { data: jobData, error: jobErr } = await supabase
      .from("jobs")
      .select("id, slug, name, description, client_id")
      .eq("slug", jobSlug)
      .maybeSingle();

    if (jobErr) {
      toast.error(jobErr.message);
      setLoading(false);
      return;
    }
    if (!jobData) {
      setDenied(true);
      setLoading(false);
      return;
    }
    setJob(jobData);

    const { data: g, error: gErr } = await supabase
      .from("goals")
      .select("id, name, description, tasks(id, title, status, progress, position)")
      .eq("job_id", jobData.id)
      .order("created_at", { ascending: true });
    if (gErr) {
      toast.error(gErr.message);
    } else {
      const mapped: GoalWithTasks[] = (g ?? []).map((goal) => ({
        id: goal.id,
        name: goal.name,
        description: goal.description,
        tasks: (goal.tasks ?? [])
          .slice()
          .sort((a, b) => a.position - b.position)
          .map((t) => ({
            id: t.id,
            title: t.title,
            status: t.status,
            progress: t.progress,
          })),
      }));
      setGoals(mapped);
    }
    setLoading(false);
  }, [user, jobSlug]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-ember" />
      </div>
    );
  }

  if (denied || !job) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-6 text-center">
        <ShieldAlert className="h-10 w-10 text-ember" />
        <h1 className="mt-4 font-display text-3xl text-foreground">Access denied</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This workspace doesn't exist or isn't assigned to your account.
        </p>
        <Link to="/portal" className="mt-6 text-xs text-ember hover:underline">
          Back to portal
        </Link>
      </div>
    );
  }

  return (
    <PortalShell
      title={job.name}
      subtitle={isAdmin ? "Viewing as admin." : job.description ?? "Your goals and tasks."}
    >
      {goals.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-8">
          {goals.map((g) => {
            const total = g.tasks.length;
            const avg = total ? Math.round(g.tasks.reduce((s, t) => s + t.progress, 0) / total) : 0;
            return (
              <section
                key={g.id}
                className="rounded-2xl border border-border/60 bg-card/40 p-6 backdrop-blur"
              >
                <div className="mb-5 flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-ember/40 bg-ember/10">
                    <Target className="h-5 w-5 text-ember" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-display text-2xl text-foreground">{g.name}</h2>
                    {g.description && (
                      <p className="mt-1 text-sm text-muted-foreground">{g.description}</p>
                    )}
                    <div className="mt-3 flex items-center gap-3">
                      <Progress value={avg} className="h-1.5 flex-1" />
                      <span className="text-xs tabular-nums text-muted-foreground">{avg}%</span>
                    </div>
                  </div>
                </div>
                {g.tasks.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No tasks assigned yet.</p>
                ) : (
                  <div className="space-y-2">
                    {g.tasks.map((task) => (
                      <TaskRow key={task.id} task={task} onChanged={load} />
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}
    </PortalShell>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-border/60 bg-card/30 p-12 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-ember/40 bg-ember/10">
        <Target className="h-6 w-6 text-ember" />
      </div>
      <h2 className="mt-4 font-display text-2xl text-foreground">No goals yet</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Goals will appear here once they're set up for this workspace.
      </p>
    </div>
  );
}
