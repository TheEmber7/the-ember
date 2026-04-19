import { HelpCircle, MessageCircle, MessageSquarePlus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useI18n } from "@/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

function callFeaturebase(action: string) {
  if (typeof window === "undefined") return;
  if (typeof window.Featurebase === "function") {
    window.Featurebase(action);
  }
}

export function HelpMenu({ className }: { className?: string }) {
  const { t } = useI18n();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t.help.label}
        className={cn(
          "inline-flex h-8 w-8 items-center justify-center rounded-full border border-border/60 bg-card/40 text-muted-foreground backdrop-blur-sm transition-all hover:border-ember/60 hover:text-ember focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          className,
        )}
      >
        <HelpCircle className="h-4 w-4" aria-hidden />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel className="text-xs uppercase tracking-wider text-muted-foreground">
          {t.help.label}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => callFeaturebase("manually_open_feedback_widget")}
          className="cursor-pointer gap-2"
        >
          <MessageSquarePlus className="h-4 w-4 text-ember" />
          <span>{t.help.feedback}</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => callFeaturebase("manually_open_chat_messenger")}
          className="cursor-pointer gap-2"
        >
          <MessageCircle className="h-4 w-4 text-ember" />
          <span>{t.help.chat}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
