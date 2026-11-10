-- Prevent clients from assigning or changing privileged profile roles.
-- The historical seed migration granted UPDATE on profiles.role to authenticated.
REVOKE UPDATE (role) ON TABLE public.profiles FROM authenticated;

CREATE OR REPLACE FUNCTION public.prevent_profile_role_escalation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Trusted server-side operations may manage roles. A normal authenticated or
  -- anonymous API request can never create or promote a manager profile.
  IF auth.role() = 'service_role'
     OR (auth.role() IS NULL AND auth.uid() IS NULL) THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' AND NEW.role = 'MANAGER' THEN
    RAISE EXCEPTION 'Only a trusted server operation can create manager profiles'
      USING ERRCODE = '42501';
  END IF;

  IF TG_OP = 'UPDATE' AND NEW.role IS DISTINCT FROM OLD.role THEN
    RAISE EXCEPTION 'Only a trusted server operation can change profile roles'
      USING ERRCODE = '42501';
  END IF;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.prevent_profile_role_escalation() FROM PUBLIC;

DROP TRIGGER IF EXISTS profiles_prevent_role_escalation ON public.profiles;
CREATE TRIGGER profiles_prevent_role_escalation
  BEFORE INSERT OR UPDATE OF role ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_profile_role_escalation();
