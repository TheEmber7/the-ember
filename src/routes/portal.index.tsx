import { createFileRoute, Link } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { usePortalAuth } from "@/hooks/usePortalAuth";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/portal/")({
  head: () => ({
    meta: [
      { title: "Portal — The Ember" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: PortalEntry,
});

function PortalEntry() {
  const { loading, session, isAdmin } = usePortalAuth();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-ember" />
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-6 text-center">
      <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Private</p>
      <h1 className="mt-3 font-display text-4xl text-foreground">
        Portal<span className="text-ember ember-glow-text">.</span>
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        This portal is invite-only. If you're a client, use the personal link you were sent.
      </p>
      {session && isAdmin && (
        <Link to="/portal/admin" className="mt-6">
          <Button>Go to admin</Button>
        </Link>
      )}
      {!session && (
        <p className="mt-6 text-xs text-muted-foreground">
          Lost your link? Reach out to the studio.
        </p>
      )}
    </div>
  );
}
