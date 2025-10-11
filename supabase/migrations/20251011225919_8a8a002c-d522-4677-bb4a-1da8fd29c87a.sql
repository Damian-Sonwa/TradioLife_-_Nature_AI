-- Create storage bucket for plant images
INSERT INTO storage.buckets (id, name, public) VALUES ('plant-images', 'plant-images', false);

-- Storage policies for plant images
CREATE POLICY "Users can upload their own plant images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'plant-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own plant images"
ON storage.objects FOR SELECT
USING (bucket_id = 'plant-images' AND auth.uid()::text = (storage.foldername(name))[1]);