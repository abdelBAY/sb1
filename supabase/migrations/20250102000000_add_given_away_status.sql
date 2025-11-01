/*
  # Add GIVEN_AWAY status to announcements

  1. Changes
    - Add 'GIVEN_AWAY' to the status check constraint
    - Allows donors to mark items as already given away

  2. Details
    - Updates announcements_status_check constraint to include 'GIVEN_AWAY'
    - Items marked as GIVEN_AWAY should prevent new requests
*/

-- Remove existing status constraint
ALTER TABLE announcements
DROP CONSTRAINT IF EXISTS announcements_status_check;

-- Add the updated status check constraint with GIVEN_AWAY
ALTER TABLE announcements
ADD CONSTRAINT announcements_status_check
CHECK (status IN ('PENDING', 'CLAIMED', 'COMPLETED', 'GIVEN_AWAY'));

