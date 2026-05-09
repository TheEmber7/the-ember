import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { Loader2, Plus, Trash2, UserPlus, Copy, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { usePortalAuth } from "@/hooks/usePortalAuth";
import { PortalShell } from "@/components/portal/PortalShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { createClientAccount } from "@/server/portal-admin.functions";

export const Route = createFileRoute("/portal/admin")({
  head: () => ({
    meta: [{ title: "Admin — The Ember" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: AdminPage,
});

interface Client {
  user_id: string;
  email: string;
}
interface Job {
  id: string;
  slug: string;
  client_id: string;
  name: string;
}
interface Goal {
  id: string;
  job_id: string;
  name: string;
}
interface Task {
  id: string;
  goal_id: string;
  title: string;
  done: boolean;
}

function AdminPage() {
  const { loading, session, isAdmin } = usePortalAuth();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-ember" />
      </div>
    );
  }
  if (!session) {
    return <AdminAuthForm />;
  }
  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <h1 className="font-display text-3xl text-foreground">Not authorized</h1>
        <p className="mt-2 text-muted-foreground">Admins only.</p>
      </div>
    );
  }
  return <AdminInner />;
}

function AdminInner() {
  const [clients, setClients] = useState<Client[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [tasksByGoal, setTasksByGoal] = useState<Record<string, Task[]>>({});
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);

    const [{ data: clientRows, error: clientErr }, { data: js }, { data: g }] = await Promise.all([
      supabase.rpc("list_client_emails"),
      supabase
        .from("jobs")
        .select("id, slug, client_id, name")
        .order("created_at", { ascending: false }),
      supabase.from("goals").select("id, job_id, name").order("created_at", { ascending: false }),
    ]);

    if (clientErr) toast.error(clientErr.message);

    setClients((clientRows ?? []) as Client[]);
    setJobs(js ?? []);
    setGoals(g ?? []);

    const goalIds = (g ?? []).map((x) => x.id);
    if (goalIds.length) {
      const { data: ts } = await supabase
        .from("tasks")
        .select("id, goal_id, title, done")
        .in("goal_id", goalIds)
        .order("created_at", { ascending: true });
      const grouped: Record<string, Task[]> = {};
      (ts ?? []).forEach((t) => {
        (grouped[t.goal_id] ??= []).push(t);
      });
      setTasksByGoal(grouped);
    } else {
      setTasksByGoal({});
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filteredGoals = selectedJob ? goals.filter((g) => g.job_id === selectedJob) : [];

  return (
    <PortalShell title="Admin" subtitle="Create client accounts, jobs, goals, and tasks.">
      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-ember" />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-[280px_1fr]">
          <aside className="space-y-2 rounded-2xl border border-border/60 bg-card/40 p-4">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-xs uppercase tracking-widest text-muted-foreground">Jobs</h2>
              <div className="flex items-center gap-1">
                <NewClientDialog onCreated={load} />
                <NewJobDialog clients={clients} onCreated={load} />
              </div>
            </div>
            {jobs.length === 0 && (
              <p className="px-3 py-2 text-xs text-muted-foreground">No jobs yet.</p>
            )}
            {jobs.map((j) => {
              const client = clients.find((c) => c.user_id === j.client_id);
              return (
                <button
                  key={j.id}
                  onClick={() => setSelectedJob(j.id)}
                  className={`w-full truncate rounded-md px-3 py-2 text-left text-sm transition-colors ${
                    selectedJob === j.id
                      ? "bg-ember/15 text-ember"
                      : "text-muted-foreground hover:bg-card hover:text-foreground"
                  }`}
                  title={`${j.name} — ${client?.email ?? "unassigned"}`}
                >
                  <div className="truncate font-medium">{j.name}</div>
                  <div className="truncate text-xs opacity-60">{client?.email ?? "unassigned"}</div>
                </button>
              );
            })}
          </aside>

          <div className="space-y-6">
            {selectedJob ? (
              <JobPanel
                job={jobs.find((j) => j.id === selectedJob)!}
                client={clients.find(
                  (c) => c.user_id === jobs.find((j) => j.id === selectedJob)?.client_id,
                )}
                goals={filteredGoals}
                tasksByGoal={tasksByGoal}
                onChanged={load}
                onJobDeleted={() => {
                  setSelectedJob(null);
                  load();
                }}
              />
            ) : (
              <div className="rounded-2xl border border-dashed border-border/60 bg-card/30 p-10 text-center text-sm text-muted-foreground">
                Select a job from the sidebar, or create one.
              </div>
            )}
          </div>
        </div>
      )}
    </PortalShell>
  );
}

function JobPanel({
  job,
  client,
  goals,
  tasksByGoal,
  onChanged,
  onJobDeleted,
}: {
  job: Job;
  client: Client | undefined;
  goals: Goal[];
  tasksByGoal: Record<string, Task[]>;
  onChanged: () => void;
  onJobDeleted: () => void;
}) {
  const link = `${typeof window !== "undefined" ? window.location.origin : ""}/portal/${job.slug}`;

  return (
    <>
      <section className="rounded-2xl border border-ember/30 bg-ember/5 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              {client?.email ?? "unassigned"}
            </p>
            <h2 className="mt-1 font-display text-2xl text-foreground">{job.name}</h2>
          </div>
          <div className="flex items-center gap-2">
            <a href={link} target="_blank" rel="noreferrer">
              <Button size="sm" variant="ghost" className="gap-2">
                <ExternalLink className="h-4 w-4" /> Open
              </Button>
            </a>
            <Button
              size="sm"
              variant="ghost"
              className="gap-2"
              onClick={() => {
                navigator.clipboard.writeText(link);
                toast.success("Client link copied");
              }}
            >
              <Copy className="h-4 w-4" /> Copy link
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={async () => {
                if (!confirm(`Delete job "${job.name}" and all its goals/tasks?`)) return;
                const { error } = await supabase.from("jobs").delete().eq("id", job.id);
                if (error) toast.error(error.message);
                else {
                  toast.success("Job deleted");
                  onJobDeleted();
                }
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="mt-3 rounded-md border border-border/40 bg-background/40 px-3 py-2 font-mono text-xs text-muted-foreground">
          {link}
        </div>
      </section>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{goals.length} goal(s)</p>
        <NewGoalDialog jobId={job.id} onCreated={onChanged} />
      </div>

      {goals.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/60 bg-card/30 p-10 text-center text-sm text-muted-foreground">
          No goals in this job. Add one above.
        </div>
      ) : (
        goals.map((g) => {
          const tasks = tasksByGoal[g.id] ?? [];
          return (
            <section key={g.id} className="rounded-2xl border border-border/60 bg-card/40 p-6">
              <header className="mb-4 flex items-start justify-between gap-4">
                <h3 className="font-display text-xl text-foreground">{g.name}</h3>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={async () => {
                    if (!confirm(`Delete goal "${g.name}" and all its tasks?`)) return;
                    const { error } = await supabase.from("goals").delete().eq("id", g.id);
                    if (error) toast.error(error.message);
                    else onChanged();
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </header>
              <div className="space-y-2">
                {tasks.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center gap-2 rounded-lg border border-border/50 bg-card/40 p-3"
                  >
                    <span
                      className={`flex-1 truncate text-sm ${
                        t.done ? "text-muted-foreground line-through" : "text-foreground"
                      }`}
                    >
                      {t.title}
                    </span>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={async () => {
                        const { error } = await supabase.from("tasks").delete().eq("id", t.id);
                        if (error) toast.error(error.message);
                        else onChanged();
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <NewTaskInline goalId={g.id} onCreated={onChanged} />
              </div>
            </section>
          );
        })
      )}
    </>
  );
}

function NewJobDialog({ clients, onCreated }: { clients: Client[]; onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [clientId, setClientId] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!clientId) return toast.error("Pick a client");
    setBusy(true);
    // slug is auto-generated by the DB default (16-char hex via gen_random_bytes(8)).
    const { error } = await supabase.from("jobs").insert({ client_id: clientId, name });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Job created");
    setName("");
    setClientId("");
    setOpen(false);
    onCreated();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-7 gap-1 px-2 text-xs">
          <Plus className="h-3.5 w-3.5" /> Job
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create job</DialogTitle>
          <DialogDescription>Generates a unique link to share with the client.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Client</Label>
            <select
              required
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
            >
              <option value="">Choose…</option>
              {clients.map((c) => (
                <option key={c.user_id} value={c.user_id}>
                  {c.email}
                </option>
              ))}
            </select>
            {clients.length === 0 && (
              <p className="text-xs text-muted-foreground">
                No client accounts yet — create one first.
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="jname">Job name</Label>
            <Input id="jname" required value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={busy}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create job"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function NewGoalDialog({ jobId, onCreated }: { jobId: string; onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.from("goals").insert({ job_id: jobId, name });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Goal created");
    setName("");
    setOpen(false);
    onCreated();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" /> New goal
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create goal</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="gname">Name</Label>
            <Input id="gname" required value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={busy}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function NewTaskInline({ goalId, onCreated }: { goalId: string; onCreated: () => void }) {
  const [title, setTitle] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        setBusy(true);
        const { error } = await supabase
          .from("tasks")
          .insert({ goal_id: goalId, title: title.trim() });
        setBusy(false);
        if (error) return toast.error(error.message);
        setTitle("");
        onCreated();
      }}
      className="flex items-center gap-2 pt-2"
    >
      <Input placeholder="Add a task…" value={title} onChange={(e) => setTitle(e.target.value)} />
      <Button type="submit" size="sm" disabled={busy} className="gap-1">
        <Plus className="h-4 w-4" /> Add
      </Button>
    </form>
  );
}

function NewClientDialog({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [created, setCreated] = useState<{ email: string; password: string } | null>(null);

  function genPassword() {
    const arr = new Uint8Array(12);
    crypto.getRandomValues(arr);
    return btoa(String.fromCharCode(...arr))
      .replace(/[+/=]/g, "")
      .slice(0, 14);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const pwd = password || genPassword();
      await createClientAccount({
        data: { email: email.trim().toLowerCase(), password: pwd },
      });
      setCreated({ email: email.trim().toLowerCase(), password: pwd });
      toast.success("Client account created");
      onCreated();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to create client";
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    setEmail("");
    setPassword("");
    setCreated(null);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" className="h-7 w-7" title="Create client account">
          <UserPlus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{created ? "Account created" : "Create client account"}</DialogTitle>
          <DialogDescription>
            {created
              ? "Share these credentials with your client securely. They won't be shown again."
              : "The client logs in with these credentials at their workspace link."}
          </DialogDescription>
        </DialogHeader>

        {created ? (
          <div className="space-y-3">
            <div className="rounded-md border border-border/40 bg-background/40 px-3 py-2 text-sm">
              <div className="text-xs text-muted-foreground">Email</div>
              <div className="font-mono">{created.email}</div>
            </div>
            <div className="rounded-md border border-border/40 bg-background/40 px-3 py-2 text-sm">
              <div className="text-xs text-muted-foreground">Password</div>
              <div className="font-mono">{created.password}</div>
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full gap-2"
              onClick={() => {
                navigator.clipboard.writeText(
                  `Email: ${created.email}\nPassword: ${created.password}`,
                );
                toast.success("Copied");
              }}
            >
              <Copy className="h-4 w-4" /> Copy credentials
            </Button>
            <DialogFooter>
              <Button onClick={() => setOpen(false)}>Done</Button>
            </DialogFooter>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="cemail">Email</Label>
              <Input
                id="cemail"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cpwd">Password (leave blank to auto-generate)</Label>
              <Input
                id="cpwd"
                type="text"
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Auto-generate"
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={busy}>
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
