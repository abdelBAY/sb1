/*
  # Update PENDING status to AVAILABLE

  1. Changes
    - Update all existing records with status 'PENDING' to 'AVAILABLE'
    - Update the status constraint to use 'AVAILABLE' instead of 'PENDING'
    - This migration ensures data consistency after changing the status value from PENDING to AVAILABLE

  2. Details
    - Finds and drops ALL constraints on the status column (handles any constraint name)
    - Updates all announcements with status 'PENDING' to 'AVAILABLE'
    - Recreates the constraint with AVAILABLE instead of PENDING
    - Safe to run multiple times (idempotent)
*/

DO $$ 
DECLARE
    constraint_name text;
BEGIN
    -- Step 1: Find and drop ALL check constraints that involve the status column
    -- This handles constraints with any name, including inline constraints
    FOR constraint_name IN 
        SELECT conname 
        FROM pg_constraint 
        WHERE conrelid = 'announcements'::regclass
        AND contype = 'c'
        AND (
            pg_get_constraintdef(oid) LIKE '%status%' 
            OR pg_get_constraintdef(oid) LIKE '%PENDING%'
            OR pg_get_constraintdef(oid) LIKE '%AVAILABLE%'
        )
    LOOP
        EXECUTE format('ALTER TABLE announcements DROP CONSTRAINT IF EXISTS %I', constraint_name);
        RAISE NOTICE 'Dropped constraint: %', constraint_name;
    END LOOP;

    -- Also explicitly try common constraint names
    ALTER TABLE announcements DROP CONSTRAINT IF EXISTS announcements_status_check;
    
    -- Step 2: Update all existing records with PENDING status to AVAILABLE
    UPDATE announcements
    SET status = 'AVAILABLE', updated_at = now()
    WHERE status = 'PENDING';

    -- Step 3: Recreate the constraint with AVAILABLE instead of PENDING
    -- Only add if it doesn't already exist (in case migration was partially run)
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conrelid = 'announcements'::regclass 
        AND conname = 'announcements_status_check'
    ) THEN
        ALTER TABLE announcements
        ADD CONSTRAINT announcements_status_check
        CHECK (status IN ('AVAILABLE', 'CLAIMED', 'COMPLETED', 'GIVEN_AWAY'));
    END IF;

END $$;

