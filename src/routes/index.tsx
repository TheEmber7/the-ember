import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Users, Brain } from "lucide-react";
import { EmberBackdrop } from "@/components/EmberBackdrop";
import { Reveal } from "@/components/Reveal";
import { useI18n } from "@/i18n/LanguageProvider";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ember Agency" },
      {
        name: "description",
        content:
          "Personal site of Horváth Zsombor (The Ember) — AI Automation and community management.",
      },
      { property: "og:title", content: "Ember Agency" },
      {
        property: "og:description",
        content: "AI Automation and community management.",
      },
    ],
  }),
  component: HomePage,
});

const HIGHLIGHT_ICONS = [Sparkles, Users, Brain] as const;

function HomePage() {
  const { t } = useI18n();
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <EmberBackdrop className="opacity-50" />
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl flex-col items-center justify-center px-6 py-24 text-center">
          {t.home.eyebrow && (
            <Reveal delay={0}>
              <p className="mb-6 text-xs uppercase tracking-[0.4em] text-muted-foreground">
                {t.home.eyebrow}
              </p>
            </Reveal>
          )}

          <Reveal delay={120}>
            <h1 className="font-display text-6xl font-semibold leading-[0.95] text-foreground sm:text-7xl md:text-8xl">
              {t.home.title}{" "}
              <span className="text-ember ember-glow-text">{t.home.titleAccent}</span>
            </h1>
          </Reveal>

          <Reveal delay={260}>
            <p className="mt-6 text-base text-muted-foreground sm:text-lg">
              {t.home.intro} <span className="text-foreground">Horváth Zsombor</span>
              {t.home.introAfter}
            </p>
          </Reveal>

          <Reveal delay={420}>
            <ul className="mt-10 flex flex-wrap items-center justify-center gap-3">
              {t.home.highlights.map((label, i) => {
                const Icon = HIGHLIGHT_ICONS[i] ?? Sparkles;
                return (
                  <li
                    key={label}
                    className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-4 py-2 text-xs text-muted-foreground backdrop-blur-sm"
                  >
                    <Icon className="h-3.5 w-3.5 text-ember" />
                    {label}
                  </li>
                );
              })}
            </ul>
          </Reveal>

          <Reveal delay={580}>
            <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row">
              <Link
                to="/services"
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground transition-all hover:brightness-110 ember-ring"
              >
                {t.home.ctaPrimary}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-border/80 px-7 py-3 text-sm font-medium text-foreground transition-colors hover:border-ember hover:text-ember"
              >
                {t.home.ctaSecondary}
              </Link>
            </div>
          </Reveal>

          <Reveal delay={900}>
            <div className="mt-24 flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
              <span>{t.home.scroll}</span>
              <span className="h-10 w-px bg-gradient-to-b from-ember to-transparent" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* INTRO STRIP */}
      <section className="relative border-y border-border/40 bg-card/20">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <Reveal>
            <p className="font-display text-2xl leading-relaxed text-foreground sm:text-3xl">
              {t.home.quote}
              <br className="hidden sm:block" />
              <span className="text-ember">{t.home.quoteAccent}</span>
            </p>
          </Reveal>
          <Reveal delay={200}>
            <Link
              to="/about"
              className="mt-10 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-ember"
            >
              {t.home.moreAbout}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
