/*
  # Add photos column to announcements table

  1. Changes
    - Add photos column as text array
    - Update existing photos column if it exists
    - Add storage bucket for photos

  2. Details
    - photos: Array of text for storing photo URLs
    - Storage bucket: 'item-photos' for storing announcement images
*/

-- First, create the storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name)
VALUES ('item-photos', 'item-photos')
ON CONFLICT (id) DO NOTHING;

-- Add RLS policy for the storage bucket
CREATE POLICY "Anyone can view item photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'item-photos');

CREATE POLICY "Authenticated users can upload item photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'item-photos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

DO $$ BEGIN
  -- Drop existing photos column if it exists with wrong type
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'announcements' 
    AND column_name = 'photos'
    AND data_type != 'ARRAY'
  ) THEN
    ALTER TABLE announcements
    DROP COLUMN photos;
  END IF;

  -- Add photos column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'announcements' 
    AND column_name = 'photos'
  ) THEN
    ALTER TABLE announcements
    ADD COLUMN photos text[];
  END IF;
END $$;