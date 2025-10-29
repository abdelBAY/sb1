-- Fix the UPDATE policy for messages to avoid OLD reference in USING clause
-- This fixes the error: "more than one row returned by a subquery used as an expression"

DROP POLICY IF EXISTS "Users can update message read status" ON messages;

CREATE POLICY "Users can update message read status"
  ON messages FOR UPDATE
  USING (
    auth.uid() = sender_id OR auth.uid() = receiver_id
  )
  WITH CHECK (
    auth.uid() = sender_id OR 
    (auth.uid() = receiver_id AND read = true)
  );

