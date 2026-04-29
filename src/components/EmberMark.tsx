import { Crown } from "lucide-react";
import { cn } from "@/lib/utils";

export function EmberMark({
  className,
  withWordmark = true,
}: {
  className?: string;
  withWordmark?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className="relative inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/30">
        <Crown className="h-4 w-4 text-primary" strokeWidth={2.2} aria-hidden />
        <span className="absolute inset-0 rounded-full bg-primary/20 blur-md animate-ember-pulse" />
      </span>
      {withWordmark && (
        <span className="font-display text-lg tracking-wide text-foreground">
          The <span className="text-ember ember-glow-text">Ember</span>
        </span>
      )}
    </span>
  );
}
