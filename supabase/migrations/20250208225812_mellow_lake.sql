-- Fix the UPDATE policy for messages to avoid OLD reference in USING clause
-- OLD can only be referenced in WITH CHECK, not in USING

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
