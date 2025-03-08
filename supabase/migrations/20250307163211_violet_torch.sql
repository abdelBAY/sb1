/*
  # Add missing columns to announcements table

  1. Changes
    - Add location column
    - Add pickup_instructions column
    - Add tags column
    - Add status column with default value

  2. Details
    - location: Text column for storing location information
    - pickup_instructions: Text column for storing pickup details
    - tags: Array of text for storing item tags
    - status: Text column with check constraint for valid values
*/

DO $$ BEGIN
  -- Add location column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'announcements' 
    AND column_name = 'location'
  ) THEN
    ALTER TABLE announcements
    ADD COLUMN location text;
  END IF;

  -- Add pickup_instructions column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'announcements' 
    AND column_name = 'pickup_instructions'
  ) THEN
    ALTER TABLE announcements
    ADD COLUMN pickup_instructions text;
  END IF;

  -- Add tags column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'announcements' 
    AND column_name = 'tags'
  ) THEN
    ALTER TABLE announcements
    ADD COLUMN tags text[];
  END IF;

  -- Add status column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'announcements' 
    AND column_name = 'status'
  ) THEN
    ALTER TABLE announcements
    ADD COLUMN status text DEFAULT 'PENDING';
  END IF;

  -- Remove existing status constraint if it exists
  ALTER TABLE announcements
  DROP CONSTRAINT IF EXISTS announcements_status_check;

  -- Add the status check constraint
  ALTER TABLE announcements
  ADD CONSTRAINT announcements_status_check
  CHECK (status IN ('PENDING', 'CLAIMED', 'COMPLETED'));
END $$;