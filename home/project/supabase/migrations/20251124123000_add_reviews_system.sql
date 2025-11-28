-- Ensure reviews table exists with the expected structure
CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id uuid NULL,
  reviewed_id uuid NULL,
  rating integer NULL,
  comment text NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT reviews_rating_check CHECK ((rating >= 1) AND (rating <= 5))
) TABLESPACE pg_default;

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Reset constraints to match the desired relationships
ALTER TABLE public.reviews
  DROP CONSTRAINT IF EXISTS fk_reviewer,
  DROP CONSTRAINT IF EXISTS reviews_reviewed_id_fkey,
  DROP CONSTRAINT IF EXISTS reviews_reviewer_id_fkey;

ALTER TABLE public.reviews
  ADD CONSTRAINT fk_reviewer FOREIGN KEY (reviewer_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
  ADD CONSTRAINT reviews_reviewed_id_fkey FOREIGN KEY (reviewed_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  ADD CONSTRAINT reviews_reviewer_id_fkey FOREIGN KEY (reviewer_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Helpful indexes for reviewer/recipient lookups
CREATE INDEX IF NOT EXISTS reviews_reviewed_id_idx ON public.reviews (reviewed_id);
CREATE INDEX IF NOT EXISTS reviews_reviewer_id_idx ON public.reviews (reviewer_id);

-- Refresh policies to support CRUD for reviewers
DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON public.reviews;
DROP POLICY IF EXISTS "Users can create reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can update own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can delete own reviews" ON public.reviews;

CREATE POLICY "Reviews are viewable by everyone"
  ON public.reviews FOR SELECT
  USING (true);

CREATE POLICY "Users can create reviews"
  ON public.reviews FOR INSERT
  WITH CHECK (auth.uid() = reviewer_id);

CREATE POLICY "Users can update own reviews"
  ON public.reviews FOR UPDATE
  USING (auth.uid() = reviewer_id);

CREATE POLICY "Users can delete own reviews"
  ON public.reviews FOR DELETE
  USING (auth.uid() = reviewer_id);

