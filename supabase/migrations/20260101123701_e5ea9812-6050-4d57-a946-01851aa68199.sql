-- Allow authenticated users to upload to clothes bucket
CREATE POLICY "Allow authenticated uploads to clothes"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'clothes');

-- Allow authenticated users to update their uploads
CREATE POLICY "Allow authenticated updates to clothes"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'clothes');

-- Allow authenticated users to delete from clothes bucket
CREATE POLICY "Allow authenticated deletes from clothes"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'clothes');

-- Allow public read access to clothes images
CREATE POLICY "Allow public read access to clothes"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'clothes');

-- Make the bucket public so images can be displayed
UPDATE storage.buckets SET public = true WHERE id = 'clothes';