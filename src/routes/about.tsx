import { createFileRoute } from "@tanstack/react-router";
import { Reveal } from "@/components/Reveal";
import { EmberBackdrop } from "@/components/EmberBackdrop";
import { Compass, Handshake, Hammer } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Horváth Zsombor (The Ember)" },
      {
        name: "description",
        content:
          "About Horváth Zsombor — philosophy, mentors (Prof. Arno Wingen, Lucky Luc), and the pillars of the work: discipline, social skill, and business craft.",
      },
      { property: "og:title", content: "About — Horváth Zsombor (The Ember)" },
      {
        property: "og:description",
        content:
          "Philosophy, mentors, and the pillars behind The Ember.",
      },
    ],
  }),
  component: AboutPage,
});

const PILLARS = [
  {
    icon: Compass,
    title: "Discipline",
    body: "Daily reps over moods. Standards over excuses.",
  },
  {
    icon: Handshake,
    title: "Social Skill",
    body: "Listening loudly, speaking clearly, building trust on purpose.",
  },
  {
    icon: Hammer,
    title: "Business Craft",
    body: "Selling honestly, solving real problems, compounding results.",
  },
];

const MENTORS = [
  {
    role: "Business Mentor",
    name: "Prof. Arno Wingen",
    body: "Sales, communication, and the boring fundamentals that actually move the needle.",
  },
  {
    role: "Self-Improvement Mentor",
    name: "Lucky Luc",
    body: "Mental frameworks for resilience, focus, and showing up as the man the work requires.",
  },
];

function AboutPage() {
  return (
    <div className="relative">
      <EmberBackdrop className="opacity-60" />

      <section className="mx-auto max-w-3xl px-6 pt-24 pb-12 text-center">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.4em] text-ember">About</p>
        </Reveal>
        <Reveal delay={120}>
          <h1 className="mt-4 font-display text-5xl text-foreground sm:text-6xl">
            The man behind the <span className="text-ember ember-glow-text">Ember</span>
          </h1>
        </Reveal>
        <Reveal delay={240}>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
            I'm Horváth Zsombor. I work at the intersection of AI systems,
            community leadership, and the inner game that decides whether any of
            it actually works. My job is to help builders, operators, and
            communities become harder to stop.
          </p>
        </Reveal>
      </section>

      {/* PILLARS */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <Reveal>
          <h2 className="text-center font-display text-3xl text-foreground">
            The Pillars
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {PILLARS.map(({ icon: Icon, title, body }, i) => (
            <Reveal key={title} delay={i * 120}>
              <div className="group relative h-full rounded-2xl border border-border/60 bg-card/50 p-7 backdrop-blur-sm transition-all hover:border-ember/60 hover:bg-card/70">
                <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/30">
                  <Icon className="h-4 w-4 text-ember" />
                </div>
                <h3 className="font-display text-xl text-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* MENTORS */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <Reveal>
          <p className="text-center text-xs uppercase tracking-[0.4em] text-ember">
            Mentors
          </p>
          <h2 className="mt-3 text-center font-display text-3xl text-foreground">
            Standing on giants
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {MENTORS.map((m, i) => (
            <Reveal key={m.name} delay={i * 150}>
              <article className="rounded-2xl border border-border/60 bg-card/50 p-8 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  {m.role}
                </p>
                <h3 className="mt-3 font-display text-2xl text-ember">
                  {m.name}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {m.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
