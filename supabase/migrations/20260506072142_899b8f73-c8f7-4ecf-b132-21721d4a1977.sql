
-- 1. Jobs table
CREATE TABLE public.jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  client_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_jobs_client_id ON public.jobs(client_id);
CREATE INDEX idx_jobs_slug ON public.jobs(slug);
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER update_jobs_updated_at
BEFORE UPDATE ON public.jobs
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2. job_belongs_to helper
CREATE OR REPLACE FUNCTION public.job_belongs_to(_job_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.jobs WHERE id = _job_id AND client_id = _user_id)
$$;

-- 3. Jobs RLS
CREATE POLICY "Admins manage jobs" ON public.jobs FOR ALL
  USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Clients view own jobs" ON public.jobs FOR SELECT
  USING (auth.uid() = client_id OR has_role(auth.uid(), 'admin'));

-- 4. Drop old goals policies that depend on client_id
DROP POLICY IF EXISTS "Admins manage goals" ON public.goals;
DROP POLICY IF EXISTS "Clients update own goals" ON public.goals;
DROP POLICY IF EXISTS "Clients view own goals" ON public.goals;

-- 5. Add job_id to goals; backfill from existing client_id
ALTER TABLE public.goals ADD COLUMN job_id UUID;

DO $$
DECLARE
  r RECORD;
  new_job_id UUID;
BEGIN
  FOR r IN SELECT DISTINCT client_id FROM public.goals WHERE client_id IS NOT NULL LOOP
    INSERT INTO public.jobs (slug, client_id, name)
    VALUES (
      'legacy-' || substr(replace(r.client_id::text, '-', ''), 1, 12),
      r.client_id,
      'Legacy workspace'
    )
    RETURNING id INTO new_job_id;
    UPDATE public.goals SET job_id = new_job_id WHERE client_id = r.client_id;
  END LOOP;
END $$;

ALTER TABLE public.goals ALTER COLUMN job_id SET NOT NULL;
ALTER TABLE public.goals DROP COLUMN client_id;
CREATE INDEX idx_goals_job_id ON public.goals(job_id);

-- 6. Recreate goals policies
CREATE POLICY "Admins manage goals" ON public.goals FOR ALL
  USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Clients view goals of own jobs" ON public.goals FOR SELECT
  USING (job_belongs_to(job_id, auth.uid()) OR has_role(auth.uid(), 'admin'));

-- 7. Update goal_belongs_to to follow goal -> job -> client chain
CREATE OR REPLACE FUNCTION public.goal_belongs_to(_goal_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.goals g
    JOIN public.jobs j ON j.id = g.job_id
    WHERE g.id = _goal_id AND j.client_id = _user_id
  )
$$;
