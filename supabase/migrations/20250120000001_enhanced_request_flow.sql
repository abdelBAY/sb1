-- Enhanced Request Flow Migration
-- This migration adds support for the improved request flow with status tracking and feedback

-- Add new columns to messages table for enhanced request flow
ALTER TABLE messages 
ADD COLUMN IF NOT EXISTS message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'request_action', 'meeting_confirmation')),
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- Create requests table to track request status
CREATE TABLE IF NOT EXISTS requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  donor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  announcement_id UUID NOT NULL REFERENCES announcements(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'completed', 'cancelled')),
  initial_message TEXT NOT NULL,
  meeting_date DATE,
  meeting_place TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(requester_id, announcement_id)
);

-- Create feedback table for post-meeting feedback
CREATE TABLE IF NOT EXISTS feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reviewed_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating TEXT NOT NULL CHECK (rating IN ('positive', 'neutral', 'negative')),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_requests_requester_id ON requests(requester_id);
CREATE INDEX IF NOT EXISTS idx_requests_donor_id ON requests(donor_id);
CREATE INDEX IF NOT EXISTS idx_requests_announcement_id ON requests(announcement_id);
CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);
CREATE INDEX IF NOT EXISTS idx_messages_message_type ON messages(message_type);
CREATE INDEX IF NOT EXISTS idx_feedback_request_id ON feedback(request_id);
CREATE INDEX IF NOT EXISTS idx_feedback_reviewer_id ON feedback(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_feedback_reviewed_id ON feedback(reviewed_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_requests_updated_at 
    BEFORE UPDATE ON requests 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add RLS policies for requests table
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view requests they are involved in (as requester or donor)
CREATE POLICY "Users can view their own requests" ON requests
  FOR SELECT USING (
    auth.uid() = requester_id OR auth.uid() = donor_id
  );

-- Policy: Users can create requests
CREATE POLICY "Users can create requests" ON requests
  FOR INSERT WITH CHECK (auth.uid() = requester_id);

-- Policy: Users can update requests they are involved in
CREATE POLICY "Users can update their requests" ON requests
  FOR UPDATE USING (
    auth.uid() = requester_id OR auth.uid() = donor_id
  );

-- Add RLS policies for feedback table
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view feedback they are involved in
CREATE POLICY "Users can view their feedback" ON feedback
  FOR SELECT USING (
    auth.uid() = reviewer_id OR auth.uid() = reviewed_id
  );

-- Policy: Users can create feedback
CREATE POLICY "Users can create feedback" ON feedback
  FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- Policy: Users can update their own feedback
CREATE POLICY "Users can update their feedback" ON feedback
  FOR UPDATE USING (auth.uid() = reviewer_id);

-- Add comments for documentation
COMMENT ON TABLE requests IS 'Tracks donation requests and their status throughout the request flow';
COMMENT ON TABLE feedback IS 'Stores post-meeting feedback between users';
COMMENT ON COLUMN messages.message_type IS 'Type of message: text, request_action, or meeting_confirmation';
COMMENT ON COLUMN messages.metadata IS 'Additional data for special message types (actions, meeting details, etc.)';
COMMENT ON COLUMN requests.status IS 'Current status of the request: pending, accepted, declined, completed, cancelled';
COMMENT ON COLUMN requests.meeting_date IS 'Confirmed meeting date for pickup';
COMMENT ON COLUMN requests.meeting_place IS 'Confirmed meeting location for pickup';
COMMENT ON COLUMN feedback.rating IS 'User experience rating: positive, neutral, or negative';
