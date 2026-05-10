import { createFileRoute, Link } from "@tanstack/react-router";
import { Bot, Users2, TrendingUp, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { EmberBackdrop } from "@/components/EmberBackdrop";
import { useI18n } from "@/i18n/LanguageProvider";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — What I Offer" },
      {
        name: "description",
        content:
          "Services by Horváth Zsombor: AI Automation (websites, chatbots, prompt engineering), community management.",
      },
      { property: "og:title", content: "Services — What I Offer" },
      {
        property: "og:description",
        content: "AI Automation, community management.",
      },
    ],
  }),
  component: ServicesPage,
});

const SERVICE_ICONS = [Bot, Users2, TrendingUp] as const;

function ServicesPage() {
  const { t } = useI18n();
  const tags = [t.services.tags.build, t.services.tags.lead];

  return (
    <div className="relative">
      <EmberBackdrop className="opacity-50" />

      <section className="mx-auto max-w-3xl px-6 pt-24 pb-12 text-center">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.4em] text-ember">{t.services.eyebrow}</p>
        </Reveal>
        <Reveal delay={120}>
          <h1 className="mt-4 font-display text-5xl text-foreground sm:text-6xl">
            {t.services.title}{" "}
            <span className="text-ember ember-glow-text">{t.services.titleAccent}</span>
          </h1>
        </Reveal>
        <Reveal delay={240}>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {t.services.intro}
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {t.services.items.map((s, i) => {
            const Icon = SERVICE_ICONS[i] ?? Bot;
            return (
              <Reveal key={s.title} delay={i * 140}>
                <article className="group relative flex h-full flex-col rounded-2xl border border-border/60 bg-card/50 p-8 backdrop-blur-sm transition-all hover:border-ember/60 hover:bg-card/70 hover:-translate-y-1">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/30">
                      <Icon className="h-5 w-5 text-ember" />
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                      {tags[i]}
                    </span>
                  </div>

                  <h2 className="font-display text-2xl text-foreground">{s.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.body}</p>

                  <ul className="mt-6 space-y-2">
                    {s.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ember" />
                        {b}
                      </li>
                    ))}
                  </ul>

                  <Link
                    to="/contact"
                    className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-ember transition-all group-hover:gap-3"
                  >
                    {t.services.workWithMe}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <Reveal>
          <h2 className="font-display text-3xl text-foreground sm:text-4xl">
            {t.services.ctaTitle}
          </h2>
        </Reveal>
        <Reveal delay={150}>
          <p className="mt-4 text-muted-foreground">{t.services.ctaBody}</p>
        </Reveal>
        <Reveal delay={300}>
          <Link
            to="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground transition-all hover:brightness-110 ember-ring"
          >
            {t.services.ctaButton}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
