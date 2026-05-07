import { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { LogOut, ShieldCheck, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePortalAuth } from "@/hooks/usePortalAuth";

export function PortalShell({
  children,
  title,
  subtitle,
  actions,
}: {
  children: ReactNode;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  const { user, isAdmin, signOut } = usePortalAuth();
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
            {isAdmin ? "Admin" : "Client portal"}
          </p>
          <h1 className="mt-2 font-display text-4xl text-foreground sm:text-5xl">
            {title}
            <span className="text-ember ember-glow-text">.</span>
          </h1>
          {subtitle && <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-3">
          {actions}
          {isAdmin && (
            <Link to="/portal/admin">
              <Button variant="outline" size="sm" className="gap-2">
                <ShieldCheck className="h-4 w-4" /> Admin
              </Button>
            </Link>
          )}
          {user?.email && (
            <span className="hidden items-center gap-2 text-xs text-muted-foreground sm:inline-flex">
              <User className="h-4 w-4" />
              {user.email}
            </span>
          )}
          <Button variant="ghost" size="sm" className="gap-2" onClick={signOut}>
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </div>
      </div>
      {children}
    </div>
  );
}
