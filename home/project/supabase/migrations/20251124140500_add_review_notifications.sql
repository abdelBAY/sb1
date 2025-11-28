-- Review notification table to alert donors when they receive feedback
CREATE TABLE IF NOT EXISTS public.review_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reviewer_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  review_id uuid NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
  message text,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT review_notifications_recipient_review_key UNIQUE (recipient_id, review_id)
);

ALTER TABLE public.review_notifications ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS review_notifications_recipient_id_idx
  ON public.review_notifications (recipient_id, read);

CREATE INDEX IF NOT EXISTS review_notifications_review_id_idx
  ON public.review_notifications (review_id);

DROP POLICY IF EXISTS "Recipients can read review notifications" ON public.review_notifications;
DROP POLICY IF EXISTS "Reviewers can create notifications" ON public.review_notifications;
DROP POLICY IF EXISTS "Recipients can manage notification read state" ON public.review_notifications;

CREATE POLICY "Recipients can read review notifications"
  ON public.review_notifications FOR SELECT
  USING (auth.uid() = recipient_id);

CREATE POLICY "Reviewers can create notifications"
  ON public.review_notifications FOR INSERT
  WITH CHECK (auth.uid() = reviewer_id);

CREATE POLICY "Recipients can manage notification read state"
  ON public.review_notifications FOR UPDATE
  USING (auth.uid() = recipient_id);

