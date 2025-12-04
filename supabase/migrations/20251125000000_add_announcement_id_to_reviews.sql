-- Add announcement_id to reviews table to link reviews to specific items
-- This ensures users can only give one review per item

-- Add announcement_id column if it doesn't exist
ALTER TABLE public.reviews
  ADD COLUMN IF NOT EXISTS announcement_id uuid NULL;

-- Add foreign key constraint
ALTER TABLE public.reviews
  DROP CONSTRAINT IF EXISTS reviews_announcement_id_fkey;

ALTER TABLE public.reviews
  ADD CONSTRAINT reviews_announcement_id_fkey 
  FOREIGN KEY (announcement_id) 
  REFERENCES public.announcements(id) 
  ON DELETE CASCADE;

-- Create index for announcement_id lookups
CREATE INDEX IF NOT EXISTS reviews_announcement_id_idx 
  ON public.reviews (announcement_id);

-- Create unique constraint to prevent duplicate reviews per item
-- A user can only review a specific item once
ALTER TABLE public.reviews
  DROP CONSTRAINT IF EXISTS reviews_reviewer_announcement_unique;

ALTER TABLE public.reviews
  ADD CONSTRAINT reviews_reviewer_announcement_unique 
  UNIQUE (reviewer_id, announcement_id);

-- Create composite index for efficient lookups
CREATE INDEX IF NOT EXISTS reviews_reviewer_announcement_idx 
  ON public.reviews (reviewer_id, announcement_id);

