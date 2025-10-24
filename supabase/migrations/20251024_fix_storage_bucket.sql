-- Fix storage bucket policies for plant-images
-- Make bucket public so images can be accessed by the classify-plant function and users

-- Update bucket to be public
UPDATE storage.buckets 
SET public = true 
WHERE id = 'plant-images';

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can view their own plant images" ON storage.objects;

-- Add new policy to allow authenticated users to view all plant images
CREATE POLICY "Authenticated users can view plant images"
ON storage.objects FOR SELECT
USING (bucket_id = 'plant-images' AND auth.role() = 'authenticated');

-- Add policy to allow public read access (needed for edge functions)
CREATE POLICY "Public read access for plant images"
ON storage.objects FOR SELECT
USING (bucket_id = 'plant-images');

-- Keep the upload policy as is (users can only upload to their own folder)
-- This policy already exists from previous migration


