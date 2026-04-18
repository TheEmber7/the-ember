import { EmberMark } from "./EmberMark";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/40 mt-24">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 md:flex-row">
        <EmberMark />
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Horváth Zsombor — The Ember. All rights reserved.
        </p>
        <p className="text-xs text-muted-foreground">
          Built with intent. Lit with purpose.
        </p>
      </div>
    </footer>
  );
}
