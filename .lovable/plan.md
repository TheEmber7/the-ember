# Client Portal — Redo Plan (MVP-scoped)

The previous attempt tried to do too much in one shot (schema + auth + client UI + admin + per-job scoping) and a parallel agent is editing the same files, causing conflicts. The redo splits the work into the smallest shippable slices, each independently testable.

## MVP definition

**In scope (must-have):**
- Private `/portal/$jobId` URL — not linked anywhere on the public site.
- Email + password login (no signup, no Google, no password reset).
- Each client sees only their own job's goals + tasks (RLS-enforced).
- Clients can toggle a task complete (single boolean — no progress slider, no statuses).
- Admin can: create a client account, create a job for that client, add goals, add tasks. View-only of other clients' progress.

**Out of scope (defer):**
- Progress sliders / multi-state status (todo/in_progress/done) — boolean `done` only.
- Reordering, drag-drop, positions.
- Editing/deleting goals or tasks after creation (just create + delete row).
- Admin promoting other admins, profile editing, display names.
- Realtime updates, notifications, email invites.
- Password reset, account self-service.

## Architecture (kept minimal)

```text
DB:
  app_role enum: 'admin' | 'client'
  user_roles(user_id, role)              — roles separated from profiles
  jobs(id, slug, client_id, name)        — slug = 16-char random hex, the URL token
  goals(id, job_id, name)
  tasks(id, goal_id, title, done bool)

RLS helpers (SECURITY DEFINER):
  has_role(uid, role)
  job_belongs_to(job_id, uid)
  goal_belongs_to(goal_id, uid)

Routes:
  /portal/$jobId   — login form if signed out, dashboard if signed in
  /portal/admin    — admin-only management UI
  (no public /portal index, no header link)

Server fn:
  createClientAccount(email, password) — uses service role to create user + assign 'client' role
```

## Step-by-step (each step = one build, independently verified)

### Step 1 — Reset & migrate schema
- Drop existing portal tables/policies/functions in one migration (clean slate, since prior migrations may have partial state).
- Re-create the 5 tables above with RLS enabled and the minimal policies:
  - `jobs`: client SELECT own; admin ALL
  - `goals`: client SELECT via job; admin ALL
  - `tasks`: client SELECT + UPDATE(done) via goal; admin ALL
  - `user_roles`: user SELECT own; admin ALL
- `handle_new_user` trigger inserts `client` role on signup.
- Stop here, verify migration applies cleanly.

### Step 2 — Auth hook + `/portal/$jobId` login + dashboard (read-only)
- `usePortalAuth` hook (session + role).
- `/portal/$jobId`: if no session → email/password login form; if session → fetch job by slug (RLS filters), render goals with task list. Access-denied state if slug returns nothing.
- No task interaction yet — pure read.

### Step 3 — Task completion toggle
- Add a checkbox per task wired to `update tasks set done = ...`.
- That's it. No slider, no status enum.

### Step 4 — Admin view (`/portal/admin`)
- Admin-only guard (redirect non-admins).
- Create client account (server fn with service role).
- Create job for a client (auto-gen slug, show shareable link).
- Per-job: add goal, add task, delete goal/task.

## Conflict-avoidance notes
Since another agent is touching this area:
- Each step is one user turn — short, scoped, easy to revert.
- No edits to `SiteHeader`, `__root.tsx`, or `routeTree.gen.ts` beyond what's strictly required (and the latter is auto-generated — don't touch).
- All portal code lives under `src/routes/portal.*`, `src/components/portal/`, `src/hooks/usePortalAuth.ts`, `src/server/portal-admin.functions.ts`. Nothing else.

## Technical details
- TanStack Start file-based routing; routes use `createFileRoute`.
- Browser Supabase client for client reads/writes (RLS enforces isolation).
- `supabaseAdmin` (service role) only inside `createServerFn` for account creation.
- Slug generated with `gen_random_bytes(8)::text` hex in DB default.
- `robots: noindex, nofollow` meta on all `/portal/*` routes.

Approve and I'll execute Step 1 (schema reset migration) in the next turn.
