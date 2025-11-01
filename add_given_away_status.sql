-- SQL to add GIVEN_AWAY status to announcements table
-- Run this in Supabase SQL Editor

-- Step 1: Remove the existing constraint if it exists
ALTER TABLE announcements
DROP CONSTRAINT IF EXISTS announcements_status_check;

-- Step 2: Update any existing rows that might have invalid status (optional, for safety)
-- This ensures all rows have a valid status before adding the new constraint
UPDATE announcements
SET status = 'PENDING'
WHERE status IS NULL OR status NOT IN ('PENDING', 'CLAIMED', 'COMPLETED', 'GIVEN_AWAY');

-- Step 3: Add the new constraint with GIVEN_AWAY included
ALTER TABLE announcements
ADD CONSTRAINT announcements_status_check
CHECK (status IN ('PENDING', 'CLAIMED', 'COMPLETED', 'GIVEN_AWAY'));

-- Verify the constraint was added (optional check)
SELECT 
    conname AS constraint_name,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'announcements'::regclass
AND conname = 'announcements_status_check';

