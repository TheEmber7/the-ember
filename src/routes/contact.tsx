import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { z } from "zod";
import { Mail, Send, CheckCircle2 } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { EmberBackdrop } from "@/components/EmberBackdrop";
import { useI18n } from "@/i18n/LanguageProvider";

const RECIPIENT_EMAIL = "TheEmberBusiness@proton.me";

const contactPayloadSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  topic: z.string().trim().min(1).max(80),
  message: z.string().trim().min(10).max(1500),
});

type ContactPayload = z.infer<typeof contactPayloadSchema>;

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const sendContactEmail = createServerFn({ method: "POST" })
  .inputValidator((data: ContactPayload) => contactPayloadSchema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("[contact] Missing RESEND_API_KEY environment variable");
      throw new Response("Email service is not configured.", { status: 500 });
    }

    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);

    const subject = `[${data.topic}] Contact from ${data.name}`;
    const html = `
      <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;line-height:1.5;color:#0f172a;">
        <h2 style="margin:0 0 12px;font-size:18px;">New contact form submission</h2>
        <p style="margin:0 0 16px;color:#475569;">Sent from theember.dev /contact</p>
        <table style="border-collapse:collapse;font-size:14px;">
          <tbody>
            <tr><td style="padding:4px 12px 4px 0;color:#64748b;">Name</td><td>${escapeHtml(data.name)}</td></tr>
            <tr><td style="padding:4px 12px 4px 0;color:#64748b;">Email</td><td>${escapeHtml(data.email)}</td></tr>
            <tr><td style="padding:4px 12px 4px 0;color:#64748b;">Topic</td><td>${escapeHtml(data.topic)}</td></tr>
          </tbody>
        </table>
        <hr style="margin:16px 0;border:none;border-top:1px solid #e2e8f0;" />
        <pre style="white-space:pre-wrap;font-family:inherit;font-size:14px;margin:0;">${escapeHtml(data.message)}</pre>
      </div>
    `;
    const text = `New contact form submission

Name: ${data.name}
Email: ${data.email}
Topic: ${data.topic}

${data.message}
`;

    const { error } = await resend.emails.send({
      from: "The Ember Contact <onboarding@resend.dev>",
      to: RECIPIENT_EMAIL,
      replyTo: data.email,
      subject,
      html,
      text,
    });

    if (error) {
      console.error("[contact] Resend send error", error);
      throw new Response("Failed to send email.", { status: 502 });
    }

    return { ok: true as const };
  });

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — The Ember" },
      {
        name: "description",
        content: "Get in touch with The Ember for AI automation, community management, or more.",
      },
      { property: "og:title", content: "Contact — The Ember" },
      {
        property: "og:description",
        content: "Tell me what you're building. I'll tell you straight if I can help.",
      },
    ],
  }),
  component: ContactPage,
});

type ContactInput = {
  name: string;
  email: string;
  topic: string;
  message: string;
};

type SubmitState =
  | { status: "idle" }
  | { status: "sending" }
  | { status: "sent" }
  | { status: "error"; message: string };

function ContactPage() {
  const { t } = useI18n();

  const contactSchema = useMemo(
    () =>
      z.object({
        name: z
          .string()
          .trim()
          .min(1, t.contact.errors.nameRequired)
          .max(100, t.contact.errors.tooLong),
        email: z
          .string()
          .trim()
          .email(t.contact.errors.emailInvalid)
          .max(255, t.contact.errors.tooLong),
        topic: z
          .string()
          .trim()
          .min(1, t.contact.errors.topicRequired)
          .max(80, t.contact.errors.tooLong),
        message: z
          .string()
          .trim()
          .min(10, t.contact.errors.messageMin)
          .max(1500, t.contact.errors.messageMax),
      }),
    [t],
  );

  const [form, setForm] = useState<ContactInput>({
    name: "",
    email: "",
    topic: t.contact.topics[0],
    message: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactInput, string>>>({});
  const [submit, setSubmit] = useState<SubmitState>({ status: "idle" });

  const update = <K extends keyof ContactInput>(k: K, v: ContactInput[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submit.status === "sending") return;

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

    setSubmit({ status: "sending" });
    try {
      await sendContactEmail({ data: parsed.data });
      setSubmit({ status: "sent" });
      setForm((f) => ({ ...f, message: "" }));
    } catch (err) {
      console.error("[contact] submit error", err);
      setSubmit({
        status: "error",
        message: err instanceof Error ? err.message : "Something went wrong.",
      });
    }
  };

  const isSending = submit.status === "sending";
  const isSent = submit.status === "sent";

  return (
    <div className="relative">
      <EmberBackdrop className="opacity-50" />

      <section className="mx-auto max-w-3xl px-6 pt-24 pb-12 text-center">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.4em] text-ember">{t.contact.eyebrow}</p>
        </Reveal>
        <Reveal delay={120}>
          <h1 className="mt-4 font-display text-5xl text-foreground sm:text-6xl">
            {t.contact.title}{" "}
            <span className="text-ember ember-glow-text">{t.contact.titleAccent}</span>
          </h1>
        </Reveal>
        <Reveal delay={240}>
          <p className="mt-6 text-base text-muted-foreground sm:text-lg">{t.contact.intro}</p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-2xl px-6 py-10">
        <Reveal>
          <form
            onSubmit={handleSubmit}
            className="space-y-5 rounded-2xl border border-border/60 bg-card/50 p-8 backdrop-blur-sm"
            noValidate
          >
            <Field label={t.contact.fields.name} error={errors.name}>
              <input
                type="text"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                maxLength={100}
                className={inputCls}
                placeholder={t.contact.placeholders.name}
                autoComplete="name"
                disabled={isSending}
              />
            </Field>

            <Field label={t.contact.fields.email} error={errors.email}>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                maxLength={255}
                className={inputCls}
                placeholder={t.contact.placeholders.email}
                autoComplete="email"
                disabled={isSending}
              />
            </Field>

            <Field label={t.contact.fields.topic} error={errors.topic}>
              <select
                value={form.topic}
                onChange={(e) => update("topic", e.target.value)}
                className={inputCls}
                disabled={isSending}
              >
                {t.contact.topics.map((topic) => (
                  <option key={topic} value={topic} className="bg-background">
                    {topic}
                  </option>
                ))}
              </select>
            </Field>

            <Field label={t.contact.fields.message} error={errors.message}>
              <textarea
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                rows={6}
                maxLength={1500}
                className={`${inputCls} resize-none`}
                placeholder={t.contact.placeholders.message}
                disabled={isSending}
              />
            </Field>

            <div className="flex items-center justify-between gap-4 pt-2">
              <p className="text-xs text-muted-foreground">{form.message.length}/1500</p>
              <button
                type="submit"
                disabled={isSending}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:brightness-110 ember-ring disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSent ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    {t.contact.sent}
                  </>
                ) : isSending ? (
                  <>
                    <Send className="h-4 w-4 animate-pulse" />
                    {t.contact.sending}
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    {t.contact.send}
                  </>
                )}
              </button>
            </div>

            {isSent && (
              <p className="rounded-md border border-ember/40 bg-ember/10 p-3 text-sm text-foreground">
                {t.contact.sentNote}
              </p>
            )}
            {submit.status === "error" && (
              <p className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-foreground">
                {submit.message} You can also email me directly at{" "}
                <a className="underline text-ember" href={`mailto:${RECIPIENT_EMAIL}`}>
                  {RECIPIENT_EMAIL}
                </a>
                .
              </p>
            )}
          </form>
        </Reveal>

        <Reveal delay={200}>
          <p className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-muted-foreground">
            <Mail className="h-3.5 w-3.5 text-ember" />
            <a className="hover:text-ember transition-colors" href={`mailto:${RECIPIENT_EMAIL}`}>
              {RECIPIENT_EMAIL}
            </a>
          </p>
        </Reveal>
      </section>
    </div>
  );
}

const inputCls =
  "w-full rounded-md border border-border/70 bg-background/60 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all focus:border-ember focus:ring-2 focus:ring-ember/30 disabled:cursor-not-allowed disabled:opacity-60";

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
      {error && <span className="mt-1.5 block text-xs text-destructive">{error}</span>}
    </label>
  );
}
