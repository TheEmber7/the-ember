import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { Loader2, Target } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { usePortalAuth } from "@/hooks/usePortalAuth";
import { PortalShell } from "@/components/portal/PortalShell";
import { TaskRow, type TaskRowData } from "@/components/portal/TaskRow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

export const Route = createFileRoute("/portal/")({
  head: () => ({
    meta: [
      { title: "Client Portal — The Ember" },
      { name: "description", content: "Sign in to view your goals and tasks." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PortalIndex,
});

function PortalIndex() {
  const { loading, session } = usePortalAuth();
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-ember" />
      </div>
    );
  }
  if (!session) return <AuthForm />;
  return <ClientDashboard />;
}

function AuthForm() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back.");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/portal`,
            data: { display_name: name || email.split("@")[0] },
          },
        });
        if (error) throw error;
        toast.success("Account created. You're in.");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Authentication failed";
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-6">
      <div className="mb-8 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
          Client portal
        </p>
        <h1 className="mt-3 font-display text-5xl text-foreground">
          The <span className="text-ember ember-glow-text">Forge</span>
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {mode === "signin" ? "Sign in to your workspace." : "Create your account."}
        </p>
      </div>

      <form
        onSubmit={submit}
        className="space-y-4 rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur"
      >
        {mode === "signup" && (
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>
        )}
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type="submit" disabled={busy} className="w-full">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : mode === "signin" ? "Sign in" : "Create account"}
        </Button>
        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="block w-full text-center text-xs text-muted-foreground transition-colors hover:text-ember"
        >
          {mode === "signin" ? "Need an account? Sign up" : "Already have an account? Sign in"}
        </button>
      </form>
    </div>
  );
}

interface GoalWithTasks {
  id: string;
  name: string;
  description: string | null;
  tasks: TaskRowData[];
}

function ClientDashboard() {
  const { user, isAdmin } = usePortalAuth();
  const [goals, setGoals] = useState<GoalWithTasks[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("goals")
      .select("id, name, description, tasks(id, title, status, progress, position)")
      .eq("client_id", user.id)
      .order("created_at", { ascending: true });
    if (error) {
      toast.error(error.message);
    } else {
      const mapped: GoalWithTasks[] = (data ?? []).map((g) => ({
        id: g.id,
        name: g.name,
        description: g.description,
        tasks: (g.tasks ?? [])
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
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <PortalShell
      title="Your Forge"
      subtitle={isAdmin ? "Viewing as client. Switch to Admin to manage everyone." : "Your goals and tasks."}
    >
      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-ember" />
        </div>
      ) : goals.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-8">
          {goals.map((g) => {
            const total = g.tasks.length;
            const avg = total
              ? Math.round(g.tasks.reduce((s, t) => s + t.progress, 0) / total)
              : 0;
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
        Your goals will appear here once they're set up. Reach out if you're waiting on something.
      </p>
    </div>
  );
}
