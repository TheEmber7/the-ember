import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { EmberBackdrop } from "@/components/EmberBackdrop";
import { useI18n } from "@/i18n/LanguageProvider";

export const Route = createFileRoute("/work")({
  head: () => ({
    meta: [
      { title: "My Work — Public Work" },
      {
        name: "description",
        content:
          "Public work by Horváth Zsombor — communities I help lead, systems I build, and projects.",
      },
      { property: "og:title", content: "My Work — Horváth Zsombor (The Ember)" },
      {
        property: "og:description",
        content: "Selected public work and communities — proof over promises.",
      },
    ],
  }),
  component: WorkPage,
});

function WorkPage() {
  const { t } = useI18n();

  return (
    <div className="relative">
      <EmberBackdrop className="opacity-60" />

      <section className="mx-auto max-w-3xl px-6 pt-24 pb-12 text-center">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.4em] text-ember">{t.work.eyebrow}</p>
        </Reveal>
        <Reveal delay={120}>
          <h1 className="mt-4 font-display text-5xl text-foreground sm:text-6xl">
            {t.work.title} <span className="text-ember ember-glow-text">{t.work.titleAccent}</span>
          </h1>
        </Reveal>
        <Reveal delay={240}>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {t.work.intro}
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {t.work.items.map((item, i) => (
            <Reveal key={item.title} delay={i * 120}>
              <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/50 p-7 backdrop-blur-sm transition-all hover:border-ember/60 hover:bg-card/70">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ember/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  {item.subtitle}
                </p>
                <h2 className="mt-3 font-display text-xl leading-snug text-foreground">
                  {item.title}
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>

                {item.url ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="mt-6 inline-flex items-center gap-2 self-start text-sm font-medium text-ember transition-colors hover:text-foreground"
                  >
                    {item.cta ?? t.work.visit}
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ) : (
                  <span className="mt-6 inline-flex items-center gap-2 self-start text-sm font-medium text-muted-foreground">
                    {item.cta ?? t.work.visit}
                  </span>
                )}
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
