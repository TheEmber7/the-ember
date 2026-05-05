import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { Loader2, Plus, Trash2, UserPlus, ChevronLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { usePortalAuth } from "@/hooks/usePortalAuth";
import { PortalShell } from "@/components/portal/PortalShell";
import { TaskRow, type TaskRowData } from "@/components/portal/TaskRow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/portal/admin")({
  head: () => ({
    meta: [
      { title: "Admin — The Ember" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

interface Client {
  user_id: string;
  email: string | null;
  display_name: string | null;
}
interface Goal {
  id: string;
  client_id: string;
  name: string;
  description: string | null;
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
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <p className="text-muted-foreground">You must sign in.</p>
        <Link to="/portal" className="mt-4 inline-block text-ember hover:underline">
          Go to portal
        </Link>
      </div>
    );
  }
  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <h1 className="font-display text-3xl text-foreground">Not authorized</h1>
        <p className="mt-2 text-muted-foreground">Admins only.</p>
        <Link to="/portal" className="mt-4 inline-block text-ember hover:underline">
          Back to portal
        </Link>
      </div>
    );
  }
  return <AdminInner />;
}

function AdminInner() {
  const [clients, setClients] = useState<Client[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [tasksByGoal, setTasksByGoal] = useState<Record<string, TaskRowData[]>>({});
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    // Get all clients (users with client role) — admins can read all profiles
    const { data: roleRows } = await supabase
      .from("user_roles")
      .select("user_id, role");
    const clientIds = (roleRows ?? [])
      .filter((r) => r.role === "client")
      .map((r) => r.user_id);

    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, email, display_name")
      .in("user_id", clientIds.length ? clientIds : ["00000000-0000-0000-0000-000000000000"]);

    setClients(profiles ?? []);

    const { data: g } = await supabase
      .from("goals")
      .select("id, client_id, name, description")
      .order("created_at", { ascending: false });
    setGoals(g ?? []);

    const goalIds = (g ?? []).map((x) => x.id);
    if (goalIds.length) {
      const { data: ts } = await supabase
        .from("tasks")
        .select("id, goal_id, title, status, progress, position")
        .in("goal_id", goalIds)
        .order("position", { ascending: true });
      const grouped: Record<string, TaskRowData[]> = {};
      (ts ?? []).forEach((t) => {
        (grouped[t.goal_id] ??= []).push({
          id: t.id,
          title: t.title,
          status: t.status,
          progress: t.progress,
        });
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

  const filteredGoals = selectedClient
    ? goals.filter((g) => g.client_id === selectedClient)
    : goals;

  return (
    <PortalShell
      title="Admin"
      subtitle="Manage clients, goals, and tasks across the agency."
      actions={
        <Link to="/portal">
          <Button variant="ghost" size="sm" className="gap-2">
            <ChevronLeft className="h-4 w-4" /> Portal
          </Button>
        </Link>
      }
    >
      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-ember" />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-[260px_1fr]">
          {/* Sidebar */}
          <aside className="space-y-2 rounded-2xl border border-border/60 bg-card/40 p-4">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-xs uppercase tracking-widest text-muted-foreground">Clients</h2>
              <PromoteClientDialog onChanged={load} />
            </div>
            <button
              onClick={() => setSelectedClient(null)}
              className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
                selectedClient === null
                  ? "bg-ember/15 text-ember"
                  : "text-muted-foreground hover:bg-card hover:text-foreground"
              }`}
            >
              All clients ({clients.length})
            </button>
            {clients.map((c) => (
              <button
                key={c.user_id}
                onClick={() => setSelectedClient(c.user_id)}
                className={`w-full truncate rounded-md px-3 py-2 text-left text-sm transition-colors ${
                  selectedClient === c.user_id
                    ? "bg-ember/15 text-ember"
                    : "text-muted-foreground hover:bg-card hover:text-foreground"
                }`}
                title={c.email ?? ""}
              >
                {c.display_name || c.email || c.user_id.slice(0, 8)}
              </button>
            ))}
          </aside>

          {/* Main */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {selectedClient
                  ? `${filteredGoals.length} goal(s) for selected client`
                  : `${filteredGoals.length} goal(s) total`}
              </p>
              <NewGoalDialog
                clients={clients}
                defaultClient={selectedClient}
                onCreated={load}
              />
            </div>

            {filteredGoals.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border/60 bg-card/30 p-10 text-center text-sm text-muted-foreground">
                No goals. Create one to get started.
              </div>
            ) : (
              filteredGoals.map((g) => {
                const client = clients.find((c) => c.user_id === g.client_id);
                const tasks = tasksByGoal[g.id] ?? [];
                return (
                  <section
                    key={g.id}
                    className="rounded-2xl border border-border/60 bg-card/40 p-6"
                  >
                    <header className="mb-4 flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-widest text-muted-foreground">
                          {client?.display_name || client?.email || "Unknown client"}
                        </p>
                        <h3 className="mt-1 font-display text-xl text-foreground">{g.name}</h3>
                        {g.description && (
                          <p className="mt-1 text-sm text-muted-foreground">{g.description}</p>
                        )}
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={async () => {
                          if (!confirm(`Delete goal "${g.name}" and all its tasks?`)) return;
                          const { error } = await supabase.from("goals").delete().eq("id", g.id);
                          if (error) toast.error(error.message);
                          else load();
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </header>
                    <div className="space-y-2">
                      {tasks.map((t) => (
                        <div key={t.id} className="flex items-center gap-2">
                          <div className="flex-1">
                            <TaskRow task={t} onChanged={load} />
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={async () => {
                              const { error } = await supabase
                                .from("tasks")
                                .delete()
                                .eq("id", t.id);
                              if (error) toast.error(error.message);
                              else load();
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <NewTaskInline goalId={g.id} nextPosition={tasks.length} onCreated={load} />
                    </div>
                  </section>
                );
              })
            )}
          </div>
        </div>
      )}
    </PortalShell>
  );
}

function NewGoalDialog({
  clients,
  defaultClient,
  onCreated,
}: {
  clients: Client[];
  defaultClient: string | null;
  onCreated: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [clientId, setClientId] = useState(defaultClient ?? "");
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (defaultClient) setClientId(defaultClient);
  }, [defaultClient]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!clientId) return toast.error("Pick a client");
    setBusy(true);
    const { error } = await supabase
      .from("goals")
      .insert({ client_id: clientId, name, description: desc || null });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Goal created");
    setName("");
    setDesc("");
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
                  {c.display_name || c.email}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="gname">Name</Label>
            <Input
              id="gname"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="gdesc">Description</Label>
            <Textarea id="gdesc" value={desc} onChange={(e) => setDesc(e.target.value)} />
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

function NewTaskInline({
  goalId,
  nextPosition,
  onCreated,
}: {
  goalId: string;
  nextPosition: number;
  onCreated: () => void;
}) {
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
          .insert({ goal_id: goalId, title: title.trim(), position: nextPosition });
        setBusy(false);
        if (error) return toast.error(error.message);
        setTitle("");
        onCreated();
      }}
      className="flex items-center gap-2 pt-2"
    >
      <Input
        placeholder="Add a task…"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Button type="submit" size="sm" disabled={busy} className="gap-1">
        <Plus className="h-4 w-4" /> Add
      </Button>
    </form>
  );
}

function PromoteClientDialog({ onChanged }: { onChanged: () => void }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    // Find profile by email
    const { data: profile, error: pErr } = await supabase
      .from("profiles")
      .select("user_id")
      .eq("email", email.trim().toLowerCase())
      .maybeSingle();
    if (pErr || !profile) {
      setBusy(false);
      return toast.error("No user with that email. They must sign up first.");
    }
    const { error } = await supabase
      .from("user_roles")
      .insert({ user_id: profile.user_id, role: "admin" });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Promoted to admin");
    setEmail("");
    setOpen(false);
    onChanged();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" className="h-7 w-7" title="Promote user to admin">
          <UserPlus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Promote user to admin</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="promote-email">User email</Label>
            <Input
              id="promote-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              The user must already have signed up.
            </p>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={busy}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Promote"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
