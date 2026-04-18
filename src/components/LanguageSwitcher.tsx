import { useI18n } from "@/i18n/LanguageProvider";
import { cn } from "@/lib/utils";
import { Languages } from "lucide-react";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { lang, setLang } = useI18n();

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-border/60 bg-card/40 p-1 backdrop-blur-sm",
        className,
      )}
      role="group"
      aria-label="Language"
    >
      <Languages className="ml-2 h-3.5 w-3.5 text-muted-foreground" aria-hidden />
      {(["en", "hu"] as const).map((code) => {
        const active = lang === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLang(code)}
            aria-pressed={active}
            className={cn(
              "rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider transition-all",
              active
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {code}
          </button>
        );
      })}
    </div>
  );
}
