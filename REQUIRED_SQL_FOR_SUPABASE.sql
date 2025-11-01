-- ============================================================
-- REQUIRED SQL TO RUN IN SUPABASE
-- ============================================================
-- Run these in your Supabase SQL Editor
-- ============================================================

-- 1. ADD GIVEN_AWAY STATUS TO ANNOUNCEMENTS
-- This allows the "Mark as Given Away" feature to work
-- ============================================================

-- Remove existing status constraint
ALTER TABLE announcements
DROP CONSTRAINT IF EXISTS announcements_status_check;

-- Add the updated status check constraint with GIVEN_AWAY
ALTER TABLE announcements
ADD CONSTRAINT announcements_status_check
CHECK (status IN ('PENDING', 'CLAIMED', 'COMPLETED', 'GIVEN_AWAY'));

-- ============================================================
-- 2. VERIFY MESSAGES UPDATE POLICY (OPTIONAL BUT RECOMMENDED)
-- This ensures messages can be marked as read correctly
-- ============================================================

-- Check if the policy exists and is correct
-- If you get errors updating messages, run this:

DROP POLICY IF EXISTS "Users can update message read status" ON messages;
DROP POLICY IF EXISTS "Users can update read status" ON messages;

-- Create the correct policy
CREATE POLICY "Users can update message read status"
  ON messages FOR UPDATE
  USING (
    auth.uid() = sender_id OR auth.uid() = receiver_id
  )
  WITH CHECK (
    auth.uid() = sender_id OR 
    (auth.uid() = receiver_id AND read = true)
  );

-- ============================================================
-- VERIFICATION QUERIES (OPTIONAL)
-- Run these to verify everything worked
-- ============================================================

-- Check announcements constraint
SELECT 
    conname AS constraint_name,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'announcements'::regclass
AND conname = 'announcements_status_check';

-- Check messages update policy
SELECT 
    polname AS policy_name,
    pg_get_expr(polqual, polrelid) AS using_expression,
    pg_get_expr(polwithcheck, polrelid) AS with_check_expression
FROM pg_policy
WHERE polrelid = 'messages'::regclass
AND polname LIKE '%update%';

