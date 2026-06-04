-- Optional extra layer: only ONE Supabase user UUID can write.
-- Dashboard → Authentication → Users → copy User UID → replace below.

DROP POLICY IF EXISTS "admin_insert" ON projects;
DROP POLICY IF EXISTS "admin_delete" ON projects;
DROP POLICY IF EXISTS "admin_upload_works" ON storage.objects;
DROP POLICY IF EXISTS "admin_delete_works" ON storage.objects;

CREATE POLICY "admin_insert"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = 'PASTE_YOUR_USER_UUID_HERE'::uuid);

CREATE POLICY "admin_delete"
  ON projects FOR DELETE
  TO authenticated
  USING (auth.uid() = 'PASTE_YOUR_USER_UUID_HERE'::uuid);

CREATE POLICY "admin_upload_works"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'works'
    AND auth.uid() = 'PASTE_YOUR_USER_UUID_HERE'::uuid
  );

CREATE POLICY "admin_delete_works"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'works'
    AND auth.uid() = 'PASTE_YOUR_USER_UUID_HERE'::uuid
  );
