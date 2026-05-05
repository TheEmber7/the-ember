import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type PortalRole = "admin" | "client" | null;

export interface PortalAuth {
  loading: boolean;
  session: Session | null;
  user: User | null;
  role: PortalRole;
  isAdmin: boolean;
  signOut: () => Promise<void>;
}

export function usePortalAuth(): PortalAuth {
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<PortalRole>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up listener BEFORE getting initial session (auth best-practice)
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (!s) {
        setRole(null);
        setLoading(false);
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (!data.session) setLoading(false);
    });

    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  // Fetch role whenever session changes
  useEffect(() => {
    if (!session?.user) return;
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id);
      if (cancelled) return;
      const roles = (data ?? []).map((r) => r.role);
      setRole(roles.includes("admin") ? "admin" : roles.includes("client") ? "client" : null);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [session]);

  return {
    loading,
    session,
    user: session?.user ?? null,
    role,
    isAdmin: role === "admin",
    signOut: async () => {
      await supabase.auth.signOut();
    },
  };
}
