-- Add done boolean to tasks (MVP)
ALTER TABLE public.tasks
  ADD COLUMN IF NOT EXISTS done boolean NOT NULL DEFAULT false;

-- Auto-generate slug for jobs
ALTER TABLE public.jobs
  ALTER COLUMN slug SET DEFAULT encode(gen_random_bytes(8), 'hex');

CREATE UNIQUE INDEX IF NOT EXISTS jobs_slug_unique ON public.jobs(slug);

-- Admin-only function returning client emails
CREATE OR REPLACE FUNCTION public.list_client_emails()
RETURNS TABLE(user_id uuid, email text)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.user_id, p.email
  FROM public.profiles p
  JOIN public.user_roles r ON r.user_id = p.user_id AND r.role = 'client'
  WHERE public.has_role(auth.uid(), 'admin'::app_role)
  ORDER BY p.email;
$$;

REVOKE ALL ON FUNCTION public.list_client_emails() FROM public, anon;
GRANT EXECUTE ON FUNCTION public.list_client_emails() TO authenticated;
