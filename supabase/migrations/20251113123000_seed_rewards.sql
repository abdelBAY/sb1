/*
  # Seed Rewards System

  1. Changes
    - Add seed_balance column to profiles with secure update controls
    - Create seed_transactions ledger table for auditing
    - Add trigger-based automation for awarding and spending seeds
    - Seed existing users with starter balances

  2. Security
    - Restrict direct seed manipulation from clients
    - Revoke execute privileges on internal functions
    - Enforce row-level access to transaction history

  3. Observability
    - Store structured context for every seed adjustment
*/

-- Ensure optional profile fields exist so column-level grants succeed
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'date_of_birth'
  ) THEN
    ALTER TABLE profiles ADD COLUMN date_of_birth text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'gender'
  ) THEN
    ALTER TABLE profiles ADD COLUMN gender text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'connect_id'
  ) THEN
    ALTER TABLE profiles ADD COLUMN connect_id text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'first_name'
  ) THEN
    ALTER TABLE profiles ADD COLUMN first_name text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'last_name'
  ) THEN
    ALTER TABLE profiles ADD COLUMN last_name text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'donation_count'
  ) THEN
    ALTER TABLE profiles ADD COLUMN donation_count integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'adoption_count'
  ) THEN
    ALTER TABLE profiles ADD COLUMN adoption_count integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'tagline'
  ) THEN
    ALTER TABLE profiles ADD COLUMN tagline text;
  END IF;
END;
$$;

-- Add the seed balance column with a controlled default
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS seed_balance integer NOT NULL DEFAULT 0;

-- Create a ledger table for all seed mutations
CREATE TABLE IF NOT EXISTS seed_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  delta integer NOT NULL,
  reason text NOT NULL CHECK (reason IN (
    'WELCOME_BONUS',
    'CONTACT',
    'REQUEST',
    'DONATION_REWARD',
    'BACKFILL'
  )),
  context jsonb NOT NULL DEFAULT '{}'::jsonb,
  balance_after integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE seed_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own seed transactions" ON seed_transactions;
CREATE POLICY "Users can view own seed transactions"
  ON seed_transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS seed_transactions_user_created_idx
  ON seed_transactions (user_id, created_at DESC);

-- Core adjustment function (not exposed to clients)
CREATE OR REPLACE FUNCTION adjust_seed_balance(
  p_user_id uuid,
  p_delta integer,
  p_reason text,
  p_context jsonb DEFAULT '{}'::jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_current integer;
  v_new integer;
BEGIN
  IF p_reason NOT IN ('WELCOME_BONUS','CONTACT','REQUEST','DONATION_REWARD','BACKFILL') THEN
    RAISE EXCEPTION USING
      ERRCODE = '22023',
      MESSAGE = format('Unsupported seed adjustment reason: %s', p_reason);
  END IF;

  SELECT seed_balance
    INTO v_current
  FROM profiles
  WHERE id = p_user_id
  FOR UPDATE;

  IF v_current IS NULL THEN
    RAISE EXCEPTION USING
      ERRCODE = 'P0002',
      MESSAGE = format('Profile not found for user %s', p_user_id);
  END IF;

  v_new := v_current + p_delta;

  IF v_new < 0 THEN
    RAISE EXCEPTION USING
      ERRCODE = 'P0001',
      MESSAGE = 'INSUFFICIENT_SEEDS',
      DETAIL = 'You’ve used all your seeds 🌱. Give something to earn more and keep growing!';
  END IF;

  UPDATE profiles
  SET seed_balance = v_new,
      updated_at = now()
  WHERE id = p_user_id;

  INSERT INTO seed_transactions (user_id, delta, reason, context, balance_after)
  VALUES (
    p_user_id,
    p_delta,
    p_reason,
    coalesce(p_context, '{}'::jsonb),
    v_new
  );
END;
$$;

REVOKE EXECUTE ON FUNCTION adjust_seed_balance(uuid, integer, text, jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION adjust_seed_balance(uuid, integer, text, jsonb) TO service_role;

-- Welcome bonus trigger after profile creation
CREATE OR REPLACE FUNCTION grant_welcome_seeds()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  PERFORM adjust_seed_balance(
    NEW.id,
    10,
    'WELCOME_BONUS',
    jsonb_build_object('source', 'registration')
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS grant_welcome_seeds_trigger ON profiles;
CREATE TRIGGER grant_welcome_seeds_trigger
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION grant_welcome_seeds();

-- Spend a seed the first time a user reaches out or requests an item
CREATE OR REPLACE FUNCTION spend_seed_on_first_message()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  v_has_prior boolean;
  v_reason text;
BEGIN
  IF NEW.sender_id IS NULL OR NEW.receiver_id IS NULL THEN
    RETURN NEW;
  END IF;

  -- Skip if this conversation already existed (any direction, scoped to the same announcement)
  SELECT EXISTS (
    SELECT 1
    FROM messages m
    WHERE m.id <> NEW.id
      AND (
        (m.sender_id = NEW.sender_id AND m.receiver_id = NEW.receiver_id) OR
        (m.sender_id = NEW.receiver_id AND m.receiver_id = NEW.sender_id)
      )
      AND (
        (m.announcement_id IS NULL AND NEW.announcement_id IS NULL) OR
        (m.announcement_id IS NOT NULL AND NEW.announcement_id IS NOT NULL AND m.announcement_id = NEW.announcement_id)
      )
  )
  INTO v_has_prior;

  IF v_has_prior THEN
    RETURN NEW;
  END IF;

  v_reason := CASE
    WHEN NEW.announcement_id IS NULL THEN 'CONTACT'
    ELSE 'REQUEST'
  END;

  PERFORM adjust_seed_balance(
    NEW.sender_id,
    -1,
    v_reason,
    jsonb_build_object(
      'message_id', NEW.id,
      'receiver_id', NEW.receiver_id,
      'announcement_id', NEW.announcement_id
    )
  );

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS spend_seed_on_first_message_trigger ON messages;
CREATE TRIGGER spend_seed_on_first_message_trigger
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION spend_seed_on_first_message();

-- Reward seeds when donations are completed or marked as given away
CREATE OR REPLACE FUNCTION reward_seeds_on_donation_status()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  v_successful_old boolean;
  v_successful_new boolean;
BEGIN
  IF NEW.user_id IS NULL THEN
    RETURN NEW;
  END IF;

  v_successful_old := coalesce(OLD.status, '') IN ('COMPLETED', 'GIVEN_AWAY');
  v_successful_new := NEW.status IN ('COMPLETED', 'GIVEN_AWAY');

  IF v_successful_new AND NOT v_successful_old THEN
    PERFORM adjust_seed_balance(
      NEW.user_id,
      2,
      'DONATION_REWARD',
      jsonb_build_object(
        'announcement_id', NEW.id,
        'status', NEW.status
      )
    );
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS reward_seeds_on_donation_status_trigger ON announcements;
CREATE TRIGGER reward_seeds_on_donation_status_trigger
  AFTER UPDATE ON announcements
  FOR EACH ROW
  WHEN (NEW.status IS DISTINCT FROM OLD.status)
  EXECUTE FUNCTION reward_seeds_on_donation_status();

-- Column-level permissions: users cannot update seed balances directly
REVOKE UPDATE ON profiles FROM authenticated;
REVOKE UPDATE ON profiles FROM anon;

GRANT UPDATE (
  username,
  full_name,
  avatar_url,
  biography,
  role,
  city,
  visibility,
  date_of_birth,
  gender,
  connect_id,
  first_name,
  last_name,
  donation_count,
  adoption_count,
  tagline,
  last_seen
) ON profiles TO authenticated;

-- Seed existing profiles with starter balance if they have none
SELECT adjust_seed_balance(
  id,
  10,
  'BACKFILL',
  jsonb_build_object('migration', '20251113_seed_rewards')
)
FROM profiles
WHERE seed_balance = 0;

