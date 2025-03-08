/*
  # Add condition column to announcements table

  1. Changes
    - Add condition column to announcements table
    - Add check constraint for condition values

  2. Details
    - Adds condition column of type text
    - Adds check constraint to ensure valid values:
      - LIKE_NEW
      - GOOD
      - WORN
      - BROKEN
*/

DO $$ BEGIN
  -- First add the condition column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'announcements' 
    AND column_name = 'condition'
  ) THEN
    ALTER TABLE announcements
    ADD COLUMN condition text;
  END IF;

  -- Remove existing constraint if it exists
  ALTER TABLE announcements
  DROP CONSTRAINT IF EXISTS announcements_condition_check;

  -- Add the new check constraint
  ALTER TABLE announcements
  ADD CONSTRAINT announcements_condition_check
  CHECK (condition IN ('LIKE_NEW', 'GOOD', 'WORN', 'BROKEN'));
END $$;