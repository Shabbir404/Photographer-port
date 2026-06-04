-- Run this in Supabase → SQL Editor if upload shows:
-- "new row violates row-level security policy"
--
-- Requires: public sign-ups DISABLED and only your admin user in Auth.

-- ============ projects table ============
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_insert" ON projects;
DROP POLICY IF EXISTS "admin_delete" ON projects;
DROP POLICY IF EXISTS "public_select" ON projects;
DROP POLICY IF EXISTS "Allow insert" ON projects;
DROP POLICY IF EXISTS "Allow delete" ON projects;

CREATE POLICY "public_select"
  ON projects FOR SELECT
  TO anon, authenticated
  USING (true);

-- Any signed-in user can write (only you can sign in if sign-ups are off)
CREATE POLICY "admin_insert"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "admin_delete"
  ON projects FOR DELETE
  TO authenticated
  USING (true);

-- ============ storage bucket "works" ============
DROP POLICY IF EXISTS "admin_upload_works" ON storage.objects;
DROP POLICY IF EXISTS "admin_delete_works" ON storage.objects;
DROP POLICY IF EXISTS "public_read_works" ON storage.objects;
DROP POLICY IF EXISTS "Allow upload" ON storage.objects;
DROP POLICY IF EXISTS "Allow delete" ON storage.objects;
DROP POLICY IF EXISTS "Public read" ON storage.objects;

CREATE POLICY "public_read_works"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'works');

CREATE POLICY "admin_upload_works"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'works');

CREATE POLICY "admin_delete_works"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'works');
