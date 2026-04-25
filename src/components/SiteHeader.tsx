import { Link, useLocation } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { EmberMark } from "./EmberMark";
import { useI18n } from "@/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const { t } = useI18n();

  const NAV = [
    { to: "/", label: t.nav.home },
    { to: "/about", label: t.nav.about },
    { to: "/work", label: t.nav.work },
    { to: "/services", label: t.nav.services },
    { to: "/contact", label: t.nav.contact },
  ] as const;

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="group" onClick={() => setOpen(false)}>
          <EmberMark />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "relative text-sm font-medium tracking-wide transition-colors",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
                <span
                  className={cn(
                    "absolute -bottom-1 left-0 h-px w-full origin-left bg-primary transition-transform duration-300",
                    active ? "scale-x-100" : "scale-x-0",
                  )}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            aria-label="Toggle navigation"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border/60 text-foreground md:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border/40 bg-background/95 px-6 py-4 md:hidden">
          <ul className="flex flex-col gap-3">
            {NAV.map((item) => {
              const active = location.pathname === item.to;
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "block py-1 text-sm",
                      active ? "text-ember" : "text-muted-foreground",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
}
