-- Create storage buckets for images
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('course-thumbnails', 'course-thumbnails', true),
  ('product-images', 'product-images', true),
  ('breed-images', 'breed-images', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create policies for public access to images
CREATE POLICY "Public Access"
  ON storage.objects FOR SELECT
  USING (bucket_id IN ('course-thumbnails', 'product-images', 'breed-images'));

-- Create policies for admin upload access
CREATE POLICY "Admin Upload Access"
  ON storage.objects FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated' 
    AND (auth.jwt() ->> 'role')::text = 'admin'
  );

CREATE POLICY "Admin Delete Access"
  ON storage.objects FOR DELETE
  USING (
    auth.role() = 'authenticated' 
    AND (auth.jwt() ->> 'role')::text = 'admin'
  );