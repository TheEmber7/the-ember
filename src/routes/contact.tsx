import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Mail, Send, Loader2, CheckCircle2 } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { EmberBackdrop } from "@/components/EmberBackdrop";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Horváth Zsombor (The Ember)" },
      {
        name: "description",
        content:
          "Get in touch with Horváth Zsombor (The Ember) for AI automation, community management, or coaching on sales and mental frameworks.",
      },
      { property: "og:title", content: "Contact — Horváth Zsombor (The Ember)" },
      {
        property: "og:description",
        content:
          "Tell me what you're building. I'll tell you straight if I can help.",
      },
    ],
  }),
  component: ContactPage,
});

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Too long"),
  email: z.string().trim().email("Invalid email").max(255, "Too long"),
  topic: z.string().trim().min(1, "Pick a topic").max(80, "Too long"),
  message: z
    .string()
    .trim()
    .min(10, "Tell me a bit more (min 10 chars)")
    .max(1500, "Keep it under 1500 chars"),
});

type ContactInput = z.infer<typeof contactSchema>;

const TOPICS = [
  "AI Automation",
  "Community Management",
  "Sales & Mental Frameworks",
  "Something else",
];

function ContactPage() {
  const [form, setForm] = useState<ContactInput>({
    name: "",
    email: "",
    topic: TOPICS[0],
    message: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactInput, string>>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "sent" | "error">(
    "idle",
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const update = <K extends keyof ContactInput>(k: K, v: ContactInput[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = contactSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof ContactInput, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof ContactInput;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setStatus("submitting");
    setErrorMsg(null);
    try {
      // Backend wiring (Lovable Cloud + email) lands in the next step.
      // Simulate latency so the UX is honest.
      await new Promise((r) => setTimeout(r, 800));
      setStatus("sent");
      setForm({ name: "", email: "", topic: TOPICS[0], message: "" });
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  return (
    <div className="relative">
      <EmberBackdrop className="opacity-50" />

      <section className="mx-auto max-w-3xl px-6 pt-24 pb-12 text-center">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.4em] text-ember">Contact</p>
        </Reveal>
        <Reveal delay={120}>
          <h1 className="mt-4 font-display text-5xl text-foreground sm:text-6xl">
            Let's <span className="text-ember ember-glow-text">talk</span>
          </h1>
        </Reveal>
        <Reveal delay={240}>
          <p className="mt-6 text-base text-muted-foreground sm:text-lg">
            Tell me what you're building or working through. I read every message.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-2xl px-6 py-10">
        <Reveal>
          <form
            onSubmit={handleSubmit}
            className="space-y-5 rounded-2xl border border-border/60 bg-card/50 p-8 backdrop-blur-sm"
            noValidate
          >
            <Field label="Your name" error={errors.name}>
              <input
                type="text"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                maxLength={100}
                className={inputCls}
                placeholder="Horváth Zsombor"
                autoComplete="name"
              />
            </Field>

            <Field label="Email" error={errors.email}>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                maxLength={255}
                className={inputCls}
                placeholder="you@domain.com"
                autoComplete="email"
              />
            </Field>

            <Field label="Topic" error={errors.topic}>
              <select
                value={form.topic}
                onChange={(e) => update("topic", e.target.value)}
                className={inputCls}
              >
                {TOPICS.map((t) => (
                  <option key={t} value={t} className="bg-background">
                    {t}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Message" error={errors.message}>
              <textarea
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                rows={6}
                maxLength={1500}
                className={`${inputCls} resize-none`}
                placeholder="Tell me what you're building, where you're stuck, or what you want to sharpen…"
              />
            </Field>

            <div className="flex items-center justify-between gap-4 pt-2">
              <p className="text-xs text-muted-foreground">
                {form.message.length}/1500
              </p>
              <button
                type="submit"
                disabled={status === "submitting" || status === "sent"}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:brightness-110 disabled:opacity-60 ember-ring"
              >
                {status === "submitting" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending…
                  </>
                ) : status === "sent" ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Message sent
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send message
                  </>
                )}
              </button>
            </div>

            {status === "sent" && (
              <p className="rounded-md border border-ember/40 bg-ember/10 p-3 text-sm text-foreground">
                Thanks — I'll be in touch shortly. (Email delivery wires up in the
                next build step.)
              </p>
            )}
            {status === "error" && errorMsg && (
              <p className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive-foreground">
                {errorMsg}
              </p>
            )}
          </form>
        </Reveal>

        <Reveal delay={200}>
          <p className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-muted-foreground">
            <Mail className="h-3.5 w-3.5 text-ember" />
            Prefer email? Mention it in the message and I'll reply directly.
          </p>
        </Reveal>
      </section>

      {/* FEATUREBASE EMBED SLOT */}
      <section className="mx-auto max-w-3xl px-6 py-20">
        <Reveal>
          <div className="rounded-2xl border border-dashed border-border/60 bg-card/30 p-8 text-center backdrop-blur-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-ember">
              Featurebase
            </p>
            <h3 className="mt-3 font-display text-2xl text-foreground">
              Feedback & Roadmap
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Drop your Featurebase widget or embed snippet here. This slot is
              ready for it.
            </p>
            {/* Paste your Featurebase embed inside this div */}
            <div
              id="featurebase-embed"
              className="mt-6 min-h-[120px] rounded-lg border border-border/40 bg-background/30 p-6 text-xs text-muted-foreground"
            >
              {/* <div data-featurebase-embed></div> */}
              Featurebase widget will render here.
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

const inputCls =
  "w-full rounded-md border border-border/70 bg-background/60 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all focus:border-ember focus:ring-2 focus:ring-ember/30";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </span>
      {children}
      {error && (
        <span className="mt-1.5 block text-xs text-destructive">{error}</span>
      )}
    </label>
  );
}
