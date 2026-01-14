-- Drop existing overly permissive storage policies for the clothes bucket
DROP POLICY IF EXISTS "Allow authenticated uploads to clothes" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates to clothes" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes from clothes" ON storage.objects;

-- Create admin-only policies for INSERT, UPDATE, DELETE
CREATE POLICY "Allow admin uploads to clothes" 
ON storage.objects 
FOR INSERT 
TO authenticated
WITH CHECK (
  bucket_id = 'clothes' AND 
  public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Allow admin updates to clothes" 
ON storage.objects 
FOR UPDATE 
TO authenticated
USING (
  bucket_id = 'clothes' AND 
  public.has_role(auth.uid(), 'admin')
)
WITH CHECK (
  bucket_id = 'clothes' AND 
  public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Allow admin deletes from clothes" 
ON storage.objects 
FOR DELETE 
TO authenticated
USING (
  bucket_id = 'clothes' AND 
  public.has_role(auth.uid(), 'admin')
);

-- Keep public read access for displaying product images (create if not exists)
DROP POLICY IF EXISTS "Allow public reads from clothes" ON storage.objects;
CREATE POLICY "Allow public reads from clothes" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'clothes');