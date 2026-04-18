import { cn } from "@/lib/utils";

/**
 * Decorative ambient ember-glow backdrop. Pure CSS, no images.
 */
export function EmberBackdrop({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
        className,
      )}
    >
      {/* Top-left golden glow */}
      <div
        className="absolute -top-32 -left-32 h-[40rem] w-[40rem] rounded-full opacity-60 blur-3xl animate-ember-pulse"
        style={{
          background:
            "radial-gradient(circle at center, color-mix(in oklab, var(--ember) 55%, transparent) 0%, transparent 65%)",
        }}
      />
      {/* Bottom-right deep blue glow */}
      <div
        className="absolute -bottom-40 -right-40 h-[44rem] w-[44rem] rounded-full opacity-70 blur-3xl animate-float-slow"
        style={{
          background:
            "radial-gradient(circle at center, color-mix(in oklab, var(--ember-glow) 35%, transparent) 0%, transparent 70%)",
        }}
      />
      {/* Subtle center ember */}
      <div
        className="absolute left-1/2 top-1/3 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at center, color-mix(in oklab, var(--ember) 40%, transparent) 0%, transparent 70%)",
        }}
      />
      {/* Grain / vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, color-mix(in oklab, var(--deep) 60%, transparent) 100%)",
        }}
      />
    </div>
  );
}
