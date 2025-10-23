/*
  # Add storage bucket for profile images

  1. New Storage
    - Create 'profile-images' bucket for storing profile pictures
  
  2. Security
    - Enable public access for reading profile images
    - Allow authenticated users to upload profile images
    - Restrict file types to images
    - Set size limits
*/

-- Create the storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-images', 'profile-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies
CREATE POLICY "Public Access for profile images"
  ON storage.objects FOR SELECT
  USING (bucket_id::text = 'profile-images');

CREATE POLICY "Authenticated users can upload profile images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id::text = 'profile-images'
    AND (LOWER(SUBSTRING(name FROM '\.([^\.]+)$')) IN ('jpg', 'jpeg', 'png', 'webp'))
    AND LENGTH(name) < 100
    AND SPLIT_PART(name, '/', 1) = auth.uid()::text
);

CREATE POLICY "Users can update own profile images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id::text = 'profile-images' 
    AND SPLIT_PART(name, '/', 1) = auth.uid()::text
  )
  WITH CHECK (
    bucket_id::text = 'profile-images' 
    AND SPLIT_PART(name, '/', 1) = auth.uid()::text
  );

CREATE POLICY "Users can delete own profile images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id::text = 'profile-images' 
    AND SPLIT_PART(name, '/', 1) = auth.uid()::text
  );
