/*
  # Add delete policy for announcements
  
  1. Changes
    - Add DELETE policy for announcements table
    - Users can delete their own announcements
  
  2. Security
    - Only the announcement owner can delete their announcements
    - RLS policy ensures users can only delete announcements they created
*/

-- Add delete policy for announcements
-- Users can delete their own announcements
CREATE POLICY "Users can delete own announcements"
  ON announcements FOR DELETE
  USING (auth.uid() = user_id);

