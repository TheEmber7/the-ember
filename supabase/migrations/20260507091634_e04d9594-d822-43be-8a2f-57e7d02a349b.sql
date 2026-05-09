-- TE-14: Client portal MVP redo — clean-slate schema.
-- Drops every artifact created by prior portal migrations and rebuilds the
-- minimal schema described in the redo plan: jobs (slug-addressed) → goals →
-- tasks (boolean done), plus a roles table (admin | client) and the RLS
-- helpers needed to keep policies non-recursive.

-- ============================================================================
-- 1. Drop existing portal artifacts
-- ============================================================================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

DROP TABLE IF EXISTS public.tasks CASCADE;
DROP TABLE IF EXISTS public.goals CASCADE;
DROP TABLE IF EXISTS public.jobs CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role) CASCADE;
DROP FUNCTION IF EXISTS public.goal_belongs_to(uuid, uuid) CASCADE;
DROP FUNCTION IF EXISTS public.job_belongs_to(uuid, uuid) CASCADE;

DROP TYPE IF EXISTS public.task_status CASCADE;
DROP TYPE IF EXISTS public.app_role CASCADE;

-- ============================================================================
-- 2. Roles
-- ============================================================================

CREATE TYPE public.app_role AS ENUM ('admin', 'client');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- SECURITY DEFINER so policies that consult roles don't recurse via RLS.
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- ============================================================================
-- 3. Jobs (slug-addressed workspace per client)
-- ============================================================================

CREATE TABLE public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE DEFAULT encode(extensions.gen_random_bytes(8), 'hex'),
  client_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_jobs_client_id ON public.jobs(client_id);
CREATE INDEX idx_jobs_slug ON public.jobs(slug);

CREATE OR REPLACE FUNCTION public.job_belongs_to(_job_id UUID, _user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.jobs WHERE id = _job_id AND client_id = _user_id
  )
$$;

-- ============================================================================
-- 4. Goals
-- ============================================================================

CREATE TABLE public.goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_goals_job_id ON public.goals(job_id);

CREATE OR REPLACE FUNCTION public.goal_belongs_to(_goal_id UUID, _user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.goals g
    JOIN public.jobs j ON j.id = g.job_id
    WHERE g.id = _goal_id AND j.client_id = _user_id
  )
$$;

-- ============================================================================
-- 5. Tasks (boolean done — no status enum, no progress, no position)
-- ============================================================================

CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id UUID NOT NULL REFERENCES public.goals(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  done BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_tasks_goal_id ON public.tasks(goal_id);

-- ============================================================================
-- 6. Auto-assign 'client' role on signup
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'client')
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 7. RLS policies (admin: ALL; client: scoped reads + tasks UPDATE)
-- ============================================================================

-- user_roles
CREATE POLICY "Users view own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- jobs
CREATE POLICY "Clients view own jobs" ON public.jobs
  FOR SELECT USING (auth.uid() = client_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage jobs" ON public.jobs
  FOR ALL USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- goals
CREATE POLICY "Clients view goals via job" ON public.goals
  FOR SELECT USING (
    public.job_belongs_to(job_id, auth.uid())
    OR public.has_role(auth.uid(), 'admin')
  );
CREATE POLICY "Admins manage goals" ON public.goals
  FOR ALL USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- tasks
CREATE POLICY "Clients view tasks via goal" ON public.tasks
  FOR SELECT USING (
    public.goal_belongs_to(goal_id, auth.uid())
    OR public.has_role(auth.uid(), 'admin')
  );
CREATE POLICY "Clients update tasks via goal" ON public.tasks
  FOR UPDATE USING (public.goal_belongs_to(goal_id, auth.uid()))
  WITH CHECK (public.goal_belongs_to(goal_id, auth.uid()));
CREATE POLICY "Admins manage tasks" ON public.tasks
  FOR ALL USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============================================================================
-- 8. Lock down helper functions to authenticated users
-- ============================================================================

REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.job_belongs_to(UUID, UUID) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.goal_belongs_to(UUID, UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.job_belongs_to(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.goal_belongs_to(UUID, UUID) TO authenticated;

-- ============================================================================
-- 9. Admin helper: list client emails (no profiles table needed)
-- ============================================================================

DROP FUNCTION IF EXISTS public.list_client_emails();

CREATE OR REPLACE FUNCTION public.list_client_emails()
RETURNS TABLE (user_id UUID, email TEXT)
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT u.id AS user_id, u.email::TEXT
  FROM auth.users u
  JOIN public.user_roles ur
    ON ur.user_id = u.id AND ur.role = 'client'
  WHERE public.has_role(auth.uid(), 'admin')
  ORDER BY u.created_at DESC
$$;

REVOKE EXECUTE ON FUNCTION public.list_client_emails() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.list_client_emails() TO authenticated;
