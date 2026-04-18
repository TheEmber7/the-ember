
## Personal Site for Horváth Zsombor — "The Ember"

### Brand & Style
- **Palette**: Deep dark blue background (`oklch(~0.18 0.05 260)`), golden hue accent (`oklch(~0.78 0.14 80)`), white text/foreground.
- **Typography**: Clean sans-serif (Inter) for body, slightly heavier display weight for headings — minimalistic.
- **Motion**: Custom `zoom-in-fade-in` keyframe applied on scroll/route entry. Subtle ember-glow ambient backgrounds (radial golden gradients, soft animated pulse) — decorative only, no heavy graphics.
- **Tone**: Minimalistic, confident, premium.

### Site Structure (multi-page, separate routes for SEO)
1. **`/` — Home**
   - Hero: "Horváth Zsombor" with "The Ember" as a glowing tagline.
   - One-liner positioning: AI Automation • Community Management • Sales & Mental Frameworks.
   - Two CTAs: "What I Offer" → `/services`, "Get in Touch" → `/contact`.
   - Animated ember/glow backdrop.

2. **`/about` — About**
   - Personal story and philosophy.
   - Mentor section highlighting **Prof. Arno Wingen** (Business) and **Lucky Luc** (Self-Improvement).
   - Pillars: Discipline · Social skill · Business craft.

3. **`/services` — What I Offer**
   - Three service cards with golden iconography:
     - **AI Automation** — websites, chatbots, prompt engineering.
     - **Community Management** — General Manager + creative work for online communities.
     - **Sales & Mental Frameworks Coaching** — social skills, business resilience, self-improvement.
   - Each card: short description + "Work with me" link to `/contact`.

4. **`/contact` — Contact**
   - Contact form (name, email, topic, message) with zod validation.
   - Form submissions are stored and you receive an email notification at your address (Lovable Cloud + built-in email).
   - Confirmation email automatically sent to the visitor.
   - Placeholder section ready for your **Featurebase widget/embed** (you'll paste the snippet when ready).

### Shared Layout
- Sticky minimalist header with logo mark ("The Ember" wordmark + small flame glyph) and nav links (Home, About, Services, Contact) with golden underline-on-active animation.
- Footer with copyright and a subtle "The Ember" mark.

### Animations
- Custom Tailwind keyframe `zoom-fade-in` (scale 0.95 → 1, opacity 0 → 1, 600ms ease-out).
- Triggered on route mount and on-scroll for sections via `IntersectionObserver`.
- Respect `prefers-reduced-motion`.

### Tech
- TanStack Start routes for each page with proper per-page SEO metadata (title, description, og tags).
- Lovable Cloud enabled for the contact form backend + email delivery.
- Featurebase embed left as a clearly marked slot — easy to drop in later.

### After this first build we can iterate on
- Real portrait/photography, case studies, testimonials, blog, booking link, custom domain.
