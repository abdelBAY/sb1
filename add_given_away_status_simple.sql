-- Simple SQL to add GIVEN_AWAY status
-- Copy and paste this entire block into Supabase SQL Editor

DO $$ 
BEGIN
  -- Drop the existing constraint if it exists
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'announcements_status_check'
    AND conrelid = 'announcements'::regclass
  ) THEN
    ALTER TABLE announcements DROP CONSTRAINT announcements_status_check;
  END IF;

  -- Add the new constraint with GIVEN_AWAY
  ALTER TABLE announcements
  ADD CONSTRAINT announcements_status_check
  CHECK (status IN ('PENDING', 'CLAIMED', 'COMPLETED', 'GIVEN_AWAY'));
END $$;

