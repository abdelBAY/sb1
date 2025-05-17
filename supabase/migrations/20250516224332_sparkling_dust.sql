/*
  # Messages System Schema

  1. New Tables
    - messages: Stores user-to-user messages
    - Includes announcement reference for context
    - Tracks read status

  2. Security
    - RLS enabled
    - Policies for read/write access
    - Sender/receiver validation

  3. Performance
    - Indexes on frequently queried columns
    - Last seen tracking for online status
*/

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES auth.users(id),
  receiver_id uuid REFERENCES auth.users(id),
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  read boolean DEFAULT false,
  announcement_id uuid REFERENCES announcements(id) ON DELETE SET NULL,
  CONSTRAINT messages_sender_receiver_check CHECK (sender_id != receiver_id)
);

-- Enable RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX IF NOT EXISTS messages_sender_id_idx ON messages(sender_id);
CREATE INDEX IF NOT EXISTS messages_receiver_id_idx ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS messages_created_at_idx ON messages(created_at);
CREATE INDEX IF NOT EXISTS messages_announcement_id_idx ON messages(announcement_id);

-- Add RLS policies
CREATE POLICY "Users can read their own messages"
  ON messages FOR SELECT
  USING (
    auth.uid() = sender_id OR
    auth.uid() = receiver_id
  );

CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id
  );

CREATE POLICY "Users can update message read status"
  ON messages FOR UPDATE
  USING (
    (auth.uid() = sender_id) OR
    (auth.uid() = receiver_id AND (OLD.read = false AND read = true))
  );

-- Add last_seen column to profiles if it doesn't exist
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'last_seen'
  ) THEN
    ALTER TABLE profiles
    ADD COLUMN last_seen timestamptz DEFAULT now();
  END IF;
END $$;

-- Create function to update last_seen
CREATE OR REPLACE FUNCTION update_last_seen()
RETURNS trigger AS $$
BEGIN
  UPDATE profiles
  SET last_seen = now()
  WHERE id = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update last_seen on message send
CREATE TRIGGER update_last_seen_on_message
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_last_seen();