import { createFileRoute } from "@tanstack/react-router";
import { EmailAPIError, sendLovableEmail } from "@lovable.dev/email-js";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  topic: z.string().trim().min(1).max(80),
  message: z.string().trim().min(10).max(1500),
});

export const Route = createFileRoute("/api/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const contentLength = Number(request.headers.get("content-length") ?? "0");
        if (contentLength > 8_000) {
          return Response.json({ error: "Message is too large." }, { status: 413 });
        }

        let payload: unknown;
        try {
          payload = await request.json();
        } catch {
          return Response.json({ error: "Invalid message format." }, { status: 400 });
        }

        const parsed = contactSchema.safeParse(payload);
        if (!parsed.success) {
          return Response.json({ error: "Please check your contact details." }, { status: 400 });
        }

        const apiKey = process.env.LOVABLE_API_KEY;
        const recipientEmail = process.env.CONTACT_RECIPIENT_EMAIL;
        const senderDomain = process.env.CONTACT_SENDER_DOMAIN;
        const fromEmail = process.env.CONTACT_FROM_EMAIL ?? `The Ember <noreply@${senderDomain}>`;

        if (!apiKey) {
          return Response.json({ error: "Email service is not configured yet." }, { status: 503 });
        }

        if (!recipientEmail || !senderDomain) {
          return Response.json(
            { error: "Contact email is not configured yet. Add the destination email first." },
            { status: 503 },
          );
        }

        const data = parsed.data;
        const messageId = crypto.randomUUID();
        const subject = `New contact request: ${data.topic}`;
        const text = [
          "New contact form submission",
          "",
          `Name: ${data.name}`,
          `Email: ${data.email}`,
          `Topic: ${data.topic}`,
          "",
          data.message,
        ].join("\n");

        try {
          await sendLovableEmail(
            {
              to: recipientEmail,
              from: fromEmail,
              sender_domain: senderDomain,
              reply_to: data.email,
              subject,
              html: renderContactEmail(data),
              text,
              purpose: "transactional",
              idempotency_key: `contact-${messageId}`,
              label: "contact-form",
            },
            { apiKey, idempotencyKey: `contact-${messageId}` },
          );

          return Response.json({ ok: true });
        } catch (error) {
          console.error("Contact email failed", error);
          const status = error instanceof EmailAPIError && error.retryable ? 503 : 500;
          return Response.json(
            { error: "Message could not be sent right now. Please try again later." },
            { status },
          );
        }
      },
    },
  },
});

type ContactMessage = z.infer<typeof contactSchema>;

function renderContactEmail(data: ContactMessage) {
  return `
    <div style="font-family: Inter, Arial, sans-serif; background: #ffffff; color: #171717; padding: 32px;">
      <div style="max-width: 620px; margin: 0 auto; border: 1px solid #e7e2d6; border-radius: 14px; overflow: hidden;">
        <div style="background: #111111; color: #f3c86a; padding: 22px 26px;">
          <p style="margin: 0; font-size: 12px; letter-spacing: 0.22em; text-transform: uppercase;">The Ember</p>
          <h1 style="margin: 8px 0 0; font-size: 26px; line-height: 1.2; color: #ffffff;">New contact request</h1>
        </div>
        <div style="padding: 26px;">
          <p style="margin: 0 0 14px; font-size: 15px;"><strong>Name:</strong> ${escapeHtml(data.name)}</p>
          <p style="margin: 0 0 14px; font-size: 15px;"><strong>Email:</strong> ${escapeHtml(data.email)}</p>
          <p style="margin: 0 0 22px; font-size: 15px;"><strong>Topic:</strong> ${escapeHtml(data.topic)}</p>
          <div style="border-top: 1px solid #eee7d8; padding-top: 22px; white-space: pre-wrap; font-size: 15px; line-height: 1.7;">${escapeHtml(data.message)}</div>
        </div>
      </div>
    </div>
  `;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}