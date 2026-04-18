import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Users, Brain } from "lucide-react";
import { EmberBackdrop } from "@/components/EmberBackdrop";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Horváth Zsombor — The Ember" },
      {
        name: "description",
        content:
          "Personal site of Horváth Zsombor (The Ember) — AI Automation, community management, and mental frameworks for sales and self-improvement.",
      },
      { property: "og:title", content: "Horváth Zsombor — The Ember" },
      {
        property: "og:description",
        content:
          "AI Automation, community management, and mental frameworks for sales and self-improvement.",
      },
    ],
  }),
  component: HomePage,
});

const HIGHLIGHTS = [
  { icon: Sparkles, label: "AI Automation" },
  { icon: Users, label: "Community Management" },
  { icon: Brain, label: "Sales & Mental Frameworks" },
];

function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <EmberBackdrop />
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl flex-col items-center justify-center px-6 py-24 text-center">
          <Reveal delay={0}>
            <p className="mb-6 text-xs uppercase tracking-[0.4em] text-muted-foreground">
              Online, I go by
            </p>
          </Reveal>

          <Reveal delay={120}>
            <h1 className="font-display text-6xl font-semibold leading-[0.95] text-foreground sm:text-7xl md:text-8xl">
              The <span className="text-ember ember-glow-text">Ember</span>
            </h1>
          </Reveal>

          <Reveal delay={260}>
            <p className="mt-6 text-base text-muted-foreground sm:text-lg">
              I am{" "}
              <span className="text-foreground">Horváth Zsombor</span> — building
              AI systems, leading communities, and sharpening minds.
            </p>
          </Reveal>

          <Reveal delay={420}>
            <ul className="mt-10 flex flex-wrap items-center justify-center gap-3">
              {HIGHLIGHTS.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-4 py-2 text-xs text-muted-foreground backdrop-blur-sm"
                >
                  <Icon className="h-3.5 w-3.5 text-ember" />
                  {label}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={580}>
            <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row">
              <Link
                to="/services"
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground transition-all hover:brightness-110 ember-ring"
              >
                What I Offer
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-border/80 px-7 py-3 text-sm font-medium text-foreground transition-colors hover:border-ember hover:text-ember"
              >
                Get in Touch
              </Link>
            </div>
          </Reveal>

          <Reveal delay={900}>
            <div className="mt-24 flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
              <span>Scroll</span>
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
              "A small ember, given the right air, can light an entire forest.
              <br className="hidden sm:block" />
              <span className="text-ember">That's the work.</span>"
            </p>
          </Reveal>
          <Reveal delay={200}>
            <Link
              to="/about"
              className="mt-10 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-ember"
            >
              More about me
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
