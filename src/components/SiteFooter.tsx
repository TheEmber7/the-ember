import { EmberMark } from "./EmberMark";
import { useI18n } from "@/i18n/LanguageProvider";

export function SiteFooter() {
  const { t } = useI18n();
  return (
    <footer className="border-t border-border/40 mt-24">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 md:flex-row">
        <EmberMark />
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Horváth Zsombor — The Ember. {t.footer.rights}
        </p>
        <p className="text-xs text-muted-foreground">{t.footer.tagline}</p>
      </div>
    </footer>
  );
}
