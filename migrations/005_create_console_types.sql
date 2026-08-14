-- 1. Create table console_types
CREATE TABLE IF NOT EXISTS console_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  image_url TEXT,
  badge VARCHAR(50),
  is_featured BOOLEAN DEFAULT false,
  features TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Storage Bucket for images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('pasrent-images', 'pasrent-images', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Set Policies for the Bucket (Public read, Authenticated users can insert/update/delete)
-- Allow public access to read files
DROP POLICY IF EXISTS "Public Access pasrent-images" ON storage.objects;
CREATE POLICY "Public Access pasrent-images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'pasrent-images');

-- Allow authenticated users to upload files
DROP POLICY IF EXISTS "Auth Insert pasrent-images" ON storage.objects;
CREATE POLICY "Auth Insert pasrent-images" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'pasrent-images');

-- Allow authenticated users to update their files
DROP POLICY IF EXISTS "Auth Update pasrent-images" ON storage.objects;
CREATE POLICY "Auth Update pasrent-images" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING (bucket_id = 'pasrent-images');

-- Allow authenticated users to delete files
DROP POLICY IF EXISTS "Auth Delete pasrent-images" ON storage.objects;
CREATE POLICY "Auth Delete pasrent-images" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (bucket_id = 'pasrent-images');

-- 4. Set RLS Policies for console_types
ALTER TABLE console_types ENABLE ROW LEVEL SECURITY;

-- Allow public read access (for customers to see console types)
CREATE POLICY "Public Read Console Types"
ON console_types FOR SELECT
USING (true);

-- Allow authenticated users (Admins) to insert/update/delete
CREATE POLICY "Auth Insert Console Types"
ON console_types FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Auth Update Console Types"
ON console_types FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Auth Delete Console Types"
ON console_types FOR DELETE
TO authenticated
USING (true);

