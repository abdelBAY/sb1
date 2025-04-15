/*
  # Add foreign key constraint for reviews-profiles relationship

  1. Changes
    - Add foreign key constraint between reviews.reviewer_id and profiles.id
    - This enables proper joining between reviews and profiles tables

  2. Security
    - No changes to RLS policies required
    - Existing policies continue to protect access to both tables
*/

ALTER TABLE reviews
ADD CONSTRAINT fk_reviewer
FOREIGN KEY (reviewer_id) REFERENCES profiles(id);